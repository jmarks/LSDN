import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuthContext } from '../contexts/AuthContext';
import OnboardingProgressBar from '../components/OnboardingProgressBar';
import './PackageShop.css';

interface Package {
    id: string;
    name: string;
    description: string;
    price: number;
    restaurant: {
        id: string;
        name: string;
        cuisineType: string;
        imageUrl: string;
    };
}

const PackageShop: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart, item: cartItem } = useShoppingCart();
    const [packages, setPackages] = useState<Package[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const { token } = useAuthContext();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('/api/packages', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPackages(response.data.data.packages);
            } catch (error) {
                console.error('Error fetching packages:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handleAddToCart = (pkg: Package) => {
        addToCart({
            packageId: pkg.id,
            name: pkg.name,
            price: pkg.price,
            restaurantName: pkg.restaurant.name
        });
        navigate('/onboarding/cart');
    };

    const filteredPackages = category === 'All'
        ? packages
        : packages.filter(p => p.restaurant.cuisineType === category);

    const categories = ['All', ...new Set(packages.map(p => p.restaurant.cuisineType))];

    return (
        <div className="onboarding-page package-shop">
            <OnboardingProgressBar />

            <div className="shop-header">
                <h1>Select your date package</h1>
                <p>Purchase a package to start meeting incredible people at the best local spots.</p>
            </div>

            <div className="shop-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-btn ${category === cat ? 'active' : ''}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="shop-loading">Loading delicious experiences...</div>
            ) : (
                <div className="package-grid">
                    {filteredPackages.map(pkg => (
                        <div key={pkg.id} className="package-card">
                            <div className="package-image">
                                <img src={pkg.restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'} alt={pkg.restaurant.name} />
                                <div className="price-tag">${pkg.price}</div>
                            </div>
                            <div className="package-info">
                                <div className="restaurant-meta">
                                    <span className="cuisine">{pkg.restaurant.cuisineType}</span>
                                    <span className="location">{pkg.restaurant.name}</span>
                                </div>
                                <h3>{pkg.name}</h3>
                                <p>{pkg.description}</p>
                                <div className="package-features">
                                    <span>✓ 5 Curated Dates</span>
                                    <span>✓ VIP Table Booking</span>
                                    <span>✓ Shared Appetizer</span>
                                </div>
                                <button
                                    className={`add-to-cart-btn ${cartItem?.packageId === pkg.id ? 'in-cart' : ''}`}
                                    onClick={() => handleAddToCart(pkg)}
                                >
                                    {cartItem?.packageId === pkg.id ? 'Already in Cart' : 'Select Package'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {cartItem && (
                <div className="floating-cart-summary" onClick={() => navigate('/onboarding/cart')}>
                    <div className="cart-icon">🛒</div>
                    <div className="cart-details">
                        <span className="item-name">{cartItem.name}</span>
                        <span className="item-price">${cartItem.price}</span>
                    </div>
                    <button className="btn-view-cart">View Cart →</button>
                </div>
            )}
        </div>
    );
};

export default PackageShop;
