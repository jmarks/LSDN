import { Router, Request, Response } from 'express';
import dataSource from '../config/database';
import { Booking } from '../entities/Booking';
import { AvailabilitySlot } from '../entities/AvailabilitySlot';
import { authMiddleware } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';

const router = Router();
const bookingRepository = dataSource.getRepository(Booking);
const slotRepository = dataSource.getRepository(AvailabilitySlot);

/**
 * @route   GET /api/bookings
 * @desc    Get user's real bookings
 * @access  Private
 */
router.get('/', authMiddleware(), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const bookings = await bookingRepository.find({
      where: [
        { userAId: userId },
        { userBId: userId }
      ],
      relations: ['restaurant', 'package', 'slot'],
      order: { createdAt: 'DESC' }
    });

    return res.json({
      success: true,
      data: bookings
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch bookings'
    });
  }
});

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', authMiddleware(), async (req: Request, res: Response) => {
  try {
    const userAId = req.user?.id;
    const { userBId, restaurantId, packageId, slotId } = req.body;

    if (!userAId || !userBId || !restaurantId || !packageId || !slotId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for booking'
      });
    }

    // 1. Check slot availability
    const slot = await slotRepository.findOne({ where: { id: slotId } });
    if (!slot || !slot.isActive || (slot.currentBookings >= slot.capacity)) {
      return res.status(400).json({
        success: false,
        message: 'Selected slot is no longer available'
      });
    }

    // 2. Generate voucher code
    const voucherCode = uuidv4().substring(0, 8).toUpperCase();

    // 3. Generate QR Code (placeholder URL for now)
    const qrCodeUrl = await QRCode.toDataURL(`LSDN-VOUCHER-${voucherCode}`);

    // 4. Create booking
    const booking = bookingRepository.create({
      userAId,
      userBId,
      restaurantId,
      packageId,
      slotId,
      bookingTime: slot.startTime,
      status: 'pending',
      voucherCode,
      qrCodeUrl
    });

    await bookingRepository.save(booking);

    // 5. Update slot availability
    slot.currentBookings += 1;
    await slotRepository.save(slot);

    return res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to create booking'
    });
  }
});

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
router.put('/:id/cancel', authMiddleware(), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await bookingRepository.findOne({
      where: { id },
      relations: ['slot']
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await bookingRepository.save(booking);

    // Release slot
    if (booking.slot) {
      booking.slot.currentBookings = Math.max(0, booking.slot.currentBookings - 1);
      await slotRepository.save(booking.slot);
    }

    return res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to cancel booking'
    });
  }
});

export default router;
