# Local Singles Date Night - Component Breakdown

**Version:** 1.0  
**Date:** January 6, 2025  
**Status:** Draft

## Table of Contents

1. [Frontend Component Architecture](#1-frontend-component-architecture)
2. [Backend Service Architecture](#2-backend-service-architecture)
3. [Database Components](#3-database-components)
4. [Integration Components](#4-integration-components)
5. [Infrastructure Components](#5-infrastructure-components)

---

## 1. Frontend Component Architecture

### 1.1 Core Application Structure

```
src/
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
├── main.tsx                   # TypeScript entry point
├── index.css                  # Global styles
├── vite-env.d.ts             # Vite TypeScript declarations
├── types/                    # TypeScript type definitions
├── components/               # Reusable UI components
├── pages/                    # Page-level components
├── services/                 # API service layer
├── store/                    # State management (Redux)
├── hooks/                    # Custom React hooks
├── utils/                    # Utility functions
├── constants/                # Application constants
├── styles/                   # Component-specific styles
└── assets/                   # Static assets
```

### 1.2 Component Hierarchy

#### Root Components
```typescript
// App.tsx
interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <AuthWrapper>
            <Layout>
              <Routes>
                {/* Route definitions */}
              </Routes>
            </Layout>
          </AuthWrapper>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
};
```

#### Layout Components
```typescript
// Layout.tsx
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen } = useAppSelector(state => state.ui);
  
  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} />
      <main className="main-content">
        <Header />
        <div className="page-content">
          {children}
        </div>
        <Footer />
      </main>
      <Modal />
      <ToastContainer />
    </div>
  );
};
```

### 1.3 Authentication Components

#### AuthWrapper Component
```typescript
// components/auth/AuthWrapper.tsx
interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/auth/login' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (requiredRoles.length > 0 && !hasRequiredRoles(user, requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
```

#### Login Form Component
```typescript
// components/auth/LoginForm.tsx
interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onForgotPassword }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(login(data)).unwrap();
      onSuccess?.(result.user);
    } catch (err) {
      // Error handled by Redux slice
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        disabled={isLoading}
      />
      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        disabled={isLoading}
      />
      {error && <ErrorMessage message={error} />}
      <Button
        type="submit"
        loading={isLoading}
        fullWidth
      >
        Sign In
      </Button>
      <div className="auth-links">
        <button
          type="button"
          onClick={onForgotPassword}
          className="link-button"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
};
```

### 1.4 User Profile Components

#### ProfileCard Component
```typescript
// components/user/ProfileCard.tsx
interface ProfileCardProps {
  user: User;
  editable?: boolean;
  onEdit?: () => void;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  user, 
  editable = false, 
  onEdit, 
  className 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`profile-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="profile-header">
        <Avatar
          src={user.profilePhotoUrl}
          alt={`${user.firstName} ${user.lastName}`}
          size="xl"
        />
        <div className="profile-info">
          <h3 className="profile-name">
            {user.firstName} {user.lastName}
          </h3>
          <p className="profile-location">
            {user.city}, {user.state}
          </p>
          {user.verifiedAt && (
            <Badge variant="success" icon="verified">
              Verified
            </Badge>
          )}
        </div>
        {editable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className={`edit-button ${isHovered ? 'visible' : ''}`}
          >
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className="profile-bio">
        <p>{user.bio}</p>
      </div>
      
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-label">Age</span>
          <span className="stat-value">{calculateAge(user.dateOfBirth)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Interests</span>
          <span className="stat-value">{user.interests.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Languages</span>
          <span className="stat-value">{user.languages.join(', ')}</span>
        </div>
      </div>
      
      {user.profilePhotos && user.profilePhotos.length > 0 && (
        <div className="profile-photos">
          {user.profilePhotos.slice(0, 4).map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Photo ${index + 1}`}
              className="profile-photo"
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

#### EditProfileForm Component
```typescript
// components/user/EditProfileForm.tsx
interface EditProfileFormProps {
  user: User;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  onCancel?: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<UpdateProfileData>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      interests: user.interests,
      languages: user.languages,
      dietaryRestrictions: user.dietaryRestrictions,
      radiusPreference: user.radiusPreference,
      ageRangeMin: user.ageRangeMin,
      ageRangeMax: user.ageRangeMax
    }
  });
  
  const handlePhotoUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    
    try {
      setPhotoUploadProgress(0);
      const result = await uploadProfilePhoto(file, (progress) => {
        setPhotoUploadProgress(progress);
      });
      
      setValue('profilePhotoUrl', result.photoUrl);
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setPhotoUploadProgress(0);
    }
  };
  
  const onSubmitForm = async (data: UpdateProfileData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="edit-profile-form">
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-grid">
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>
        
        <Textarea
          label="Bio"
          {...register('bio')}
          maxLength={150}
          error={errors.bio?.message}
        />
      </div>
      
      <div className="form-section">
        <h3>Preferences</h3>
        <div className="form-grid">
          <Controller
            control={control}
            name="interests"
            render={({ field }) => (
              <MultiSelect
                label="Interests"
                options={INTEREST_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.interests?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="languages"
            render={({ field }) => (
              <MultiSelect
                label="Languages"
                options={LANGUAGE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={errors.languages?.message}
              />
            )}
          />
        </div>
        
        <div className="form-grid">
          <Input
            label="Search Radius (miles)"
            type="number"
            {...register('radiusPreference', { valueAsNumber: true })}
            error={errors.radiusPreference?.message}
          />
          <div className="age-range-input">
            <label className="form-label">Age Range</label>
            <div className="age-range-controls">
              <Input
                type="number"
                {...register('ageRangeMin', { valueAsNumber: true })}
                placeholder="Min"
                className="age-input"
              />
              <span className="age-range-separator">to</span>
              <Input
                type="number"
                {...register('ageRangeMax', { valueAsNumber: true })}
                placeholder="Max"
                className="age-input"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <Button type="submit" loading={isSubmitting}>
          Save Changes
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
```

### 1.5 Restaurant Components

#### RestaurantCard Component
```typescript
// components/restaurant/RestaurantCard.tsx
interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect?: (restaurant: Restaurant) => void;
  className?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  onSelect, 
  className 
}) => {
  const navigate = useNavigate();
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect(restaurant);
    } else {
      navigate(`/restaurants/${restaurant.id}`);
    }
  };
  
  return (
    <div className={`restaurant-card ${className}`} onClick={handleSelect}>
      <div className="restaurant-image">
        <img 
          src={restaurant.photos?.[0] || '/placeholder-restaurant.jpg'}
          alt={restaurant.name}
          className="restaurant-photo"
        />
        <div className="restaurant-overlay">
          <Button variant="ghost" size="sm" className="view-details-btn">
            View Details
          </Button>
        </div>
      </div>
      
      <div className="restaurant-content">
        <div className="restaurant-header">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <div className="restaurant-rating">
            <StarIcon className="star-icon" />
            <span className="rating-value">{restaurant.rating}</span>
            <span className="rating-count">({restaurant.reviewsCount})</span>
          </div>
        </div>
        
        <div className="restaurant-meta">
          <div className="meta-item">
            <MapPinIcon className="meta-icon" />
            <span>{restaurant.distance} miles away</span>
          </div>
          <div className="meta-item">
            <UtensilsIcon className="meta-icon" />
            <span>{restaurant.cuisineType}</span>
          </div>
          <div className="meta-item">
            <DollarSignIcon className="meta-icon" />
            <span>{restaurant.priceRange}</span>
          </div>
        </div>
        
        <p className="restaurant-description">
          {restaurant.description}
        </p>
        
        <div className="restaurant-actions">
          <Button 
            variant="primary" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/restaurants/${restaurant.id}`);
            }}
          >
            View Packages
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Add to favorites logic
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
```

#### RestaurantDetail Component
```typescript
// components/restaurant/RestaurantDetail.tsx
interface RestaurantDetailProps {
  restaurantId: string;
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurantId }) => {
  const { data: restaurant, isLoading, error } = useGetRestaurantQuery(restaurantId);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !restaurant) {
    return <ErrorMessage message="Restaurant not found" />;
  }
  
  return (
    <div className="restaurant-detail">
      <div className="restaurant-hero">
        <div className="hero-image">
          <img 
            src={restaurant.photos?.[0] || '/placeholder-hero.jpg'}
            alt={restaurant.name}
            className="hero-photo"
          />
        </div>
        <div className="hero-content">
          <h1 className="restaurant-title">{restaurant.name}</h1>
          <div className="restaurant-info">
            <div className="info-item">
              <MapPinIcon />
              <span>{restaurant.address.line1}</span>
            </div>
            <div className="info-item">
              <PhoneIcon />
              <span>{restaurant.phone}</span>
            </div>
            <div className="info-item">
              <ClockIcon />
              <span>Open until {restaurant.hours?.close}</span>
            </div>
          </div>
          <div className="restaurant-actions">
            <Button variant="primary" size="lg">
              Book Now
            </Button>
            <Button variant="outline" size="lg">
              View Menu
            </Button>
          </div>
        </div>
      </div>
      
      <div className="restaurant-content">
        <div className="content-grid">
          <div className="packages-section">
            <h2>Available Packages</h2>
            <div className="package-list">
              {restaurant.packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onSelect={setSelectedPackage}
                  selected={selectedPackage?.id === pkg.id}
                />
              ))}
            </div>
          </div>
          
          <div className="availability-section">
            <h2>Select Date & Time</h2>
            {selectedPackage && (
              <AvailabilityCalendar
                package={selectedPackage}
                restaurantId={restaurant.id}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            )}
          </div>
        </div>
        
        <div className="restaurant-about">
          <h2>About {restaurant.name}</h2>
          <p>{restaurant.description}</p>
          
          <div className="restaurant-features">
            <div className="feature-item">
              <CheckIcon />
              <span>Wheelchair accessible</span>
            </div>
            <div className="feature-item">
              <CheckIcon />
              <span>Outdoor seating</span>
            </div>
            <div className="feature-item">
              <CheckIcon />
              <span>Vegetarian options</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 1.6 Booking Components

#### MatchingForm Component
```typescript
// components/booking/MatchingForm.tsx
interface MatchingFormProps {
  onSubmit: (data: MatchingRequest) => void;
  isLoading?: boolean;
}

const MatchingForm: React.FC<MatchingFormProps> = ({ onSubmit, isLoading }) => {
  const [timeRange, setTimeRange] = useState<[Date, Date]>([
    addHours(new Date(), 2),
    addHours(new Date(), 5)
  ]);
  const [experienceTypes, setExperienceTypes] = useState<string[]>(['dinner']);
  const [maxDistance, setMaxDistance] = useState(10);
  
  const handleSubmit = () => {
    const data: MatchingRequest = {
      preferredTimeStart: timeRange[0].toISOString(),
      preferredTimeEnd: timeRange[1].toISOString(),
      experienceTypes,
      maxDistance
    };
    
    onSubmit(data);
  };
  
  return (
    <div className="matching-form">
      <h2>Find Your Match</h2>
      
      <div className="form-group">
        <label className="form-label">When would you like to go?</label>
        <div className="time-range-picker">
          <DatePicker
            selected={timeRange[0]}
            onChange={(date) => setTimeRange([date!, timeRange[1]])}
            showTimeSelect
            timeIntervals={30}
            dateFormat="MM/dd/yyyy h:mm aa"
            placeholderText="Start time"
          />
          <span className="time-separator">to</span>
          <DatePicker
            selected={timeRange[1]}
            onChange={(date) => setTimeRange([timeRange[0], date!])}
            showTimeSelect
            timeIntervals={30}
            dateFormat="MM/dd/yyyy h:mm aa"
            placeholderText="End time"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">What type of experience?</label>
        <div className="experience-types">
          {EXPERIENCE_TYPES.map((type) => (
            <Checkbox
              key={type.value}
              label={type.label}
              checked={experienceTypes.includes(type.value)}
              onChange={(checked) => {
                if (checked) {
                  setExperienceTypes([...experienceTypes, type.value]);
                } else {
                  setExperienceTypes(experienceTypes.filter(t => t !== type.value));
                }
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">How far are you willing to travel?</label>
        <div className="distance-slider">
          <input
            type="range"
            min="1"
            max="50"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseInt(e.target.value))}
          />
          <span className="distance-value">{maxDistance} miles</span>
        </div>
      </div>
      
      <Button
        onClick={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
      >
        Find Matches
      </Button>
    </div>
  );
};
```

#### CandidateList Component
```typescript
// components/booking/CandidateList.tsx
interface CandidateListProps {
  candidates: Candidate[];
  onAsk: (candidateId: string, message?: string) => void;
  remainingAsks: number;
  isLoading?: boolean;
}

const CandidateList: React.FC<CandidateListProps> = ({ 
  candidates, 
  onAsk, 
  remainingAsks, 
  isLoading 
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  
  const handleAsk = (candidateId: string) => {
    onAsk(candidateId, customMessage);
    setCustomMessage('');
    setSelectedCandidate(null);
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (candidates.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h3>No matches found</h3>
        <p>Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }
  
  return (
    <div className="candidate-list">
      <div className="candidates-header">
        <h3>Available Matches</h3>
        <div className="asks-remaining">
          {remainingAsks} asks remaining
        </div>
      </div>
      
      <div className="candidates-grid">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onAsk={(message) => handleAsk(candidate.id)}
            onMessageChange={setCustomMessage}
            isSelected={selectedCandidate === candidate.id}
            onSelect={() => setSelectedCandidate(candidate.id)}
            disabled={remainingAsks === 0}
          />
        ))}
      </div>
    </div>
  );
};
```

### 1.7 Messaging Components

#### ConversationList Component
```typescript
// components/messaging/ConversationList.tsx
interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewMessage: (message: Message) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation,
  onNewMessage 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(conversation =>
    conversation.withUser.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.withUser.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h3>Messages</h3>
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="conversation-items">
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversationId === conversation.id}
            onSelect={() => onSelectConversation(conversation.id)}
            onNewMessage={onNewMessage}
          />
        ))}
      </div>
    </div>
  );
};
```

#### MessageThread Component
```typescript
// components/messaging/MessageThread.tsx
interface MessageThreadProps {
  conversationId: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const MessageThread: React.FC<MessageThreadProps> = ({ 
  conversationId, 
  messages, 
  onSendMessage, 
  isLoading 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="message-thread">
      <div className="message-header">
        <div className="thread-info">
          <Avatar src={messages[0]?.sender.profilePhotoUrl} />
          <div className="thread-details">
            <h4>{messages[0]?.sender.firstName} {messages[0]?.sender.lastName}</h4>
            <span className="thread-status">Online</span>
          </div>
        </div>
        <div className="thread-actions">
          <Button variant="ghost" size="sm" icon={<PhoneIcon />}>
            Call
          </Button>
          <Button variant="ghost" size="sm" icon={<VideoIcon />}>
            Video
          </Button>
        </div>
      </div>
      
      <div className="message-container">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === getCurrentUserId()}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="message-input">
        <div className="input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

## 2. Backend Service Architecture

### 2.1 Service Layer Components

#### AuthService
```typescript
// src/services/AuthService.ts
interface AuthServiceInterface {
  register(userData: RegisterData): Promise<AuthResponse>;
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<TokenResponse>;
  logout(refreshToken: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
}

class AuthService implements AuthServiceInterface {
  private userRepository: UserRepository;
  private emailService: EmailService;
  private jwtService: JWTService;
  
  async register(userData: RegisterData): Promise<AuthResponse> {
    // 1. Validate input data
    const validatedData = await this.validateRegistration(userData);
    
    // 2. Check if email already exists
    const existingUser = await this.userRepository.findByEmail(validatedData.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }
    
    // 3. Hash password
    const hashedPassword = await this.hashPassword(validatedData.password);
    
    // 4. Create user
    const user = await this.userRepository.create({
      ...validatedData,
      passwordHash: hashedPassword,
      verificationToken: generateVerificationToken()
    });
    
    // 5. Generate tokens
    const tokens = this.jwtService.generateTokens(user);
    
    // 6. Send verification email
    await this.emailService.sendVerificationEmail(user, tokens.verificationToken);
    
    // 7. Return auth response
    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
  
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    // 2. Verify password
    const isPasswordValid = await this.verifyPassword(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    // 3. Check if user is verified
    if (user.verificationStatus !== 'verified') {
      throw new AuthenticationError('Please verify your email address');
    }
    
    // 4. Generate tokens
    const tokens = this.jwtService.generateTokens(user);
    
    // 5. Update last login
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });
    
    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
  
  private sanitizeUser(user: User): User {
    const { passwordHash, verificationToken, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
```

#### MatchingService
```typescript
// src/services/MatchingService.ts
interface MatchingServiceInterface {
  findMatches(request: MatchingRequest): Promise<Candidate[]>;
  createBooking(userAId: string, userBId: string, slotId: string): Promise<Booking>;
  calculateMatchScore(userA: User, userB: User, slot: AvailabilitySlot): number;
  getMatchingStats(userId: string): Promise<MatchingStats>;
}

class MatchingService implements MatchingServiceInterface {
  private userRepository: UserRepository;
  private availabilityService: AvailabilityService;
  private bookingService: BookingService;
  
  async findMatches(request: MatchingRequest): Promise<Candidate[]> {
    // 1. Find compatible users in radius
    const compatibleUsers = await this.findCompatibleUsers(request);
    
    // 2. Filter by availability
    const availableUsers = await this.filterByAvailability(compatibleUsers, request);
    
    // 3. Apply matching algorithm
    const scoredCandidates = await this.applyMatchingAlgorithm(availableUsers, request);
    
    // 4. Return top candidates
    return scoredCandidates.slice(0, 20);
  }
  
  private async findCompatibleUsers(request: MatchingRequest): Promise<User[]> {
    const { location, maxDistance, ageRangeMin, ageRangeMax } = request;
    
    return await this.userRepository.findNearbyUsers(
      location, 
      maxDistance, 
      {
        ageRangeMin,
        ageRangeMax,
        verifiedOnly: true
      }
    );
  }
  
  private async filterByAvailability(
    users: User[], 
    request: MatchingRequest
  ): Promise<User[]> {
    const { preferredTimeStart, preferredTimeEnd, experienceTypes } = request;
    
    const availableUsers: User[] = [];
    
    for (const user of users) {
      // Check if user has available packages for the experience type
      const hasPackages = await this.userRepository.hasPackagesForExperience(
        user.id, 
        experienceTypes
      );
      
      if (hasPackages) {
        availableUsers.push(user);
      }
    }
    
    return availableUsers;
  }
  
  private async applyMatchingAlgorithm(
    users: User[], 
    request: MatchingRequest
  ): Promise<Candidate[]> {
    const candidates: Candidate[] = [];
    
    for (const user of users) {
      // Calculate match score
      const score = this.calculateMatchScore(request.user, user, request.slot);
      
      // Get compatible restaurants
      const restaurants = await this.getCompatibleRestaurants(user, request);
      
      candidates.push({
        id: generateId(),
        user: this.sanitizeUser(user),
        restaurants,
        matchScore: score,
        reasons: this.generateMatchReasons(request.user, user, request.slot)
      });
    }
    
    // Sort by match score
    return candidates.sort((a, b) => b.matchScore - a.matchScore);
  }
  
  calculateMatchScore(userA: User, userB: User, slot: AvailabilitySlot): number {
    let score = 0;
    
    // Shared interests (30%)
    const sharedInterests = userA.interests.filter(interest => 
      userB.interests.includes(interest)
    ).length;
    score += (sharedInterests / Math.max(userA.interests.length, userB.interests.length)) * 30;
    
    // Distance penalty (25%)
    const distance = calculateDistance(userA.location, userB.location);
    const distanceScore = Math.max(0, 25 - (distance * 2.5));
    score += distanceScore;
    
    // Age compatibility (15%)
    const ageDiff = Math.abs(userA.age - userB.age);
    const ageScore = Math.max(0, 15 - (ageDiff * 1.5));
    score += ageScore;
    
    // Language compatibility (10%)
    const sharedLanguages = userA.languages.filter(lang => 
      userB.languages.includes(lang)
    ).length;
    score += (sharedLanguages / Math.max(userA.languages.length, userB.languages.length)) * 10;
    
    // Time preference match (20%)
    const timeMatch = this.calculateTimePreferenceMatch(userA, userB, slot);
    score += timeMatch;
    
    return Math.round(score);
  }
}
```

#### BookingService
```typescript
// src/services/BookingService.ts
interface BookingServiceInterface {
  createBooking(bookingData: CreateBookingData): Promise<Booking>;
  confirmBooking(bookingId: string, userId: string): Promise<Booking>;
  cancelBooking(bookingId: string, userId: string, reason: string): Promise<Booking>;
  getBooking(bookingId: string): Promise<Booking>;
  getUserBookings(userId: string, filters?: BookingFilters): Promise<Booking[]>;
  getRestaurantBookings(restaurantId: string, date: Date): Promise<Booking[]>;
}

class BookingService implements BookingServiceInterface {
  private bookingRepository: BookingRepository;
  private userRepository: UserRepository;
  private availabilityService: AvailabilityService;
  private notificationService: NotificationService;
  private voucherService: VoucherService;
  
  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    const { userAId, userBId, restaurantId, packageId, slotId, bookingTime } = bookingData;
    
    // 1. Validate booking data
    await this.validateBookingData(bookingData);
    
    // 2. Check availability
    const isAvailable = await this.availabilityService.isSlotAvailable(slotId, bookingTime);
    if (!isAvailable) {
      throw new ConflictError('Time slot is not available');
    }
    
    // 3. Check user packages
    const userAPackage = await this.userRepository.getPackage(userAId, packageId);
    const userBPackage = await this.userRepository.getPackage(userBId, packageId);
    
    if (!userAPackage || userAPackage.remainingUnits <= 0) {
      throw new ValidationError('User A does not have enough package units');
    }
    
    if (!userBPackage || userBPackage.remainingUnits <= 0) {
      throw new ValidationError('User B does not have enough package units');
    }
    
    // 4. Create booking
    const booking = await this.bookingRepository.create({
      userAId,
      userBId,
      restaurantId,
      packageId,
      slotId,
      bookingTime,
      status: 'pending',
      voucherCode: this.voucherService.generateVoucherCode(),
      createdAt: new Date()
    });
    
    // 5. Generate voucher
    const voucher = await this.voucherService.createVoucher(booking);
    
    // 6. Send notifications
    await this.notificationService.sendBookingCreatedNotification(booking);
    
    return {
      ...booking,
      voucherCode: voucher.code,
      qrCodeUrl: voucher.qrCodeUrl
    };
  }
  
  async confirmBooking(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }
    
    // Check if user is part of the booking
    if (booking.userAId !== userId && booking.userBId !== userId) {
      throw new AuthorizationError('User not authorized for this booking');
    }
    
    // Update booking status
    const confirmedBooking = await this.bookingRepository.update(bookingId, {
      status: 'confirmed',
      confirmedAt: new Date(),
      confirmedBy: userId
    });
    
    // Send confirmation notification
    await this.notificationService.sendBookingConfirmedNotification(confirmedBooking);
    
    return confirmedBooking;
  }
}
```

### 2.2 Controller Layer Components

#### AuthController
```typescript
// src/controllers/AuthController.ts
class AuthController {
  private authService: AuthService;
  private validator: AuthValidator;
  
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validate request
      const validatedData = this.validator.validateRegistration(req.body);
      
      // 2. Call service
      const result = await this.authService.register(validatedData);
      
      // 3. Return response
      res.status(201).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || generateId()
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validate request
      const validatedData = this.validator.validateLogin(req.body);
      
      // 2. Call service
      const result = await this.authService.login(validatedData);
      
      // 3. Set refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // 4. Return response
      res.json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || generateId()
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        throw new AuthenticationError('Refresh token required');
      }
      
      const result = await this.authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || generateId()
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        data: {
          message: 'Successfully logged out'
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || generateId()
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
```

#### BookingController
```typescript
// src/controllers/BookingController.ts
class BookingController {
  private bookingService: BookingService;
  private matchingService: MatchingService;
  private validator: BookingValidator;
  
  async submitMatchingRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedData = this.validator.validateMatchingRequest(req.body);
      
      const result = await this.matchingService.findMatches({
        ...validatedData,
        userId
      });
      
      res.json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || generateId()
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedData = this.validator.validateCreateBooking(req.body);
      
      const booking = await this.bookingService.createBooking({
        ...validatedData,
        userAId: userId
      });
      
      res.status(201).json({
        success: true,
        data: booking,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || generateId()
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getUserBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const filters = this.validator.validateBookingFilters(req.query);
      
      const bookings = await this.bookingService.getUserBookings(userId, filters);
      
      res.json({
        success: true,
        data: bookings,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'] || generateId()
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### 2.3 Repository Layer Components

#### BaseRepository
```typescript
// src/repositories/BaseRepository.ts
abstract class BaseRepository<T> {
  protected model: EntityTarget<T>;
  protected entityManager: EntityManager;
  
  constructor(model: EntityTarget<T>, entityManager: EntityManager) {
    this.model = model;
    this.entityManager = entityManager;
  }
  
  async findById(id: string): Promise<T | null> {
    return await this.entityManager.findOne(this.model, { where: { id } });
  }
  
  async findByEmail(email: string): Promise<T | null> {
    return await this.entityManager.findOne(this.model, { where: { email } });
  }
  
  async create(data: Partial<T>): Promise<T> {
    const entity = this.entityManager.create(this.model, data);
    return await this.entityManager.save(entity);
  }
  
  async update(id: string, data: Partial<T>): Promise<T | null> {
    await this.entityManager.update(this.model, id, data);
    return await this.findById(id);
  }
  
  async delete(id: string): Promise<boolean> {
    const result = await this.entityManager.delete(this.model, id);
    return result.affected! > 0;
  }
  
  async find(options: FindManyOptions<T>): Promise<T[]> {
    return await this.entityManager.find(this.model, options);
  }
  
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.entityManager.findOne(this.model, options);
  }
  
  async count(options?: FindManyOptions<T>): Promise<number> {
    return await this.entityManager.count(this.model, options);
  }
}
```

#### UserRepository
```typescript
// src/repositories/UserRepository.ts
class UserRepository extends BaseRepository<User> {
  constructor(entityManager: EntityManager) {
    super(User, entityManager);
  }
  
  async findNearbyUsers(
    location: Point, 
    radius: number, 
    filters?: { ageRangeMin?: number; ageRangeMax?: number; verifiedOnly?: boolean }
  ): Promise<User[]> {
    const queryBuilder = this.entityManager
      .createQueryBuilder(User, 'user')
      .where('ST_DWithin(user.location, ST_Point(:lat, :lng), :radius)', {
        lat: location.latitude,
        lng: location.longitude,
        radius: radius * 1609.34 // Convert miles to meters
      });
    
    if (filters?.ageRangeMin) {
      queryBuilder.andWhere('user.age >= :ageMin', { ageMin: filters.ageRangeMin });
    }
    
    if (filters?.ageRangeMax) {
      queryBuilder.andWhere('user.age <= :ageMax', { ageMax: filters.ageRangeMax });
    }
    
    if (filters?.verifiedOnly) {
      queryBuilder.andWhere('user.verificationStatus = :status', { status: 'verified' });
    }
    
    return await queryBuilder.getMany();
  }
  
  async hasPackagesForExperience(userId: string, experienceTypes: string[]): Promise<boolean> {
    const result = await this.entityManager
      .createQueryBuilder(UserPackage, 'userPackage')
      .innerJoin(Package, 'package', 'userPackage.packageId = package.id')
      .where('userPackage.userId = :userId', { userId })
      .andWhere('userPackage.remainingUnits > 0')
      .andWhere('package.experienceType IN (:...experienceTypes)', { experienceTypes })
      .getCount();
    
    return result > 0;
  }
  
  async getPackage(userId: string, packageId: string): Promise<UserPackage | null> {
    return await this.entityManager.findOne(UserPackage, {
      where: {
        userId,
        packageId,
        remainingUnits: MoreThan(0)
      }
    });
  }
  
  async decrementPackageUnits(userId: string, packageId: string, amount: number = 1): Promise<void> {
    await this.entityManager
      .createQueryBuilder()
      .update(UserPackage)
      .set({
        remainingUnits: () => `remaining_units - ${amount}`
      })
      .where('userId = :userId', { userId })
      .andWhere('packageId = :packageId', { packageId })
      .andWhere('remainingUnits >= :amount', { amount })
      .execute();
  }
}
```

#### BookingRepository
```typescript
// src/repositories/BookingRepository.ts
class BookingRepository extends BaseRepository<Booking> {
  constructor(entityManager: EntityManager) {
    super(Booking, entityManager);
  }
  
  async findByUsers(userAId: string, userBId: string): Promise<Booking[]> {
    return await this.entityManager.find(Booking, {
      where: [
        { userAId, userBId },
        { userAId: userBId, userBId: userAId }
      ],
      relations: ['userA', 'userB', 'restaurant', 'package']
    });
  }
  
  async findByRestaurantAndDate(restaurantId: string, date: Date): Promise<Booking[]> {
    const startOfDay = startOfDay(date);
    const endOfDay = endOfDay(date);
    
    return await this.entityManager.find(Booking, {
      where: {
        restaurantId,
        bookingTime: Between(startOfDay, endOfDay),
        status: In(['confirmed', 'pending'])
      },
      relations: ['userA', 'userB', 'package']
    });
  }
  
  async findUpcomingBookings(userId: string, limit: number = 10): Promise<Booking[]> {
    return await this.entityManager.find(Booking, {
      where: [
        { userAId: userId, bookingTime: MoreThan(new Date()) },
        { userBId: userId, bookingTime: MoreThan(new Date()) }
      ],
      relations: ['userA', 'userB', 'restaurant', 'package'],
      order: { bookingTime: 'ASC' },
      take: limit
    });
  }
}
```

---

## 3. Database Components

### 3.1 Entity Models

#### User Entity
```typescript
// src/entities/User.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  passwordHash: string;
  
  @Column()
  firstName: string;
  
  @Column()
  lastName: string;
  
  @Column({ nullable: true })
  dateOfBirth: Date;
  
  @Column({ nullable: true })
  gender: string;
  
  @Column({ type: 'text', nullable: true, length: 150 })
  bio: string;
  
  @Column({ nullable: true })
  profilePhotoUrl: string;
  
  @Column({ type: 'jsonb', nullable: true })
  profilePhotos: string[];
  
  @Column({ type: 'point' })
  location: Point;
  
  @Column()
  city: string;
  
  @Column()
  state: string;
  
  @Column()
  country: string;
  
  @Column()
  zipCode: string;
  
  @Column({ default: 10 })
  radiusPreference: number;
  
  @Column({ default: 25 })
  ageRangeMin: number;
  
  @Column({ default: 45 })
  ageRangeMax: number;
  
  @Column({ type: 'jsonb', default: [] })
  interests: string[];
  
  @Column({ type: 'jsonb', default: [] })
  languages: string[];
  
  @Column({ type: 'jsonb', default: [] })
  dietaryRestrictions: string[];
  
  @Column({ nullable: true })
  verifiedAt: Date;
  
  @Column({ default: 'pending' })
  verificationStatus: string;
  
  @Column({ default: true })
  isActive: boolean;
  
  @Column({ nullable: true })
  deletedAt: Date;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ nullable: true })
  lastLoginAt: Date;
  
  // Relations
  @OneToMany(() => UserPackage, userPackage => userPackage.user)
  packages: UserPackage[];
  
  @OneToMany(() => Booking, booking => booking.userA)
  bookingsAsUserA: Booking[];
  
  @OneToMany(() => Booking, booking => booking.userB)
  bookingsAsUserB: Booking[];
  
  @OneToMany(() => Message, message => message.sender)
  sentMessages: Message[];
  
  @OneToMany(() => Message, message => message.receiver)
  receivedMessages: Message[];
}
```

#### Restaurant Entity
```typescript
// src/entities/Restaurant.ts
@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  name: string;
  
  @Column({ type: 'text', nullable: true })
  description: string;
  
  @Column()
  addressLine1: string;
  
  @Column({ nullable: true })
  addressLine2: string;
  
  @Column()
  city: string;
  
  @Column()
  state: string;
  
  @Column()
  country: string;
  
  @Column()
  zipCode: string;
  
  @Column({ type: 'point' })
  location: Point;
  
  @Column({ nullable: true })
  phone: string;
  
  @Column({ nullable: true })
  email: string;
  
  @Column({ nullable: true })
  websiteUrl: string;
  
  @Column()
  cuisineType: string;
  
  @Column()
  priceRange: string;
  
  @Column()
  capacity: number;
  
  @Column({ default: 'pending' })
  partnerStatus: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ nullable: true })
  deletedAt: Date;
  
  // Relations
  @OneToMany(() => Package, package => package.restaurant)
  packages: Package[];
  
  @OneToMany(() => AvailabilitySlot, slot => slot.restaurant)
  availabilitySlots: AvailabilitySlot[];
  
  @OneToMany(() => Booking, booking => booking.restaurant)
  bookings: Booking[];
}
```

### 3.2 Database Migrations

#### Initial Migration
```typescript
// src/migrations/1704067200000-CreateInitialSchema.ts
export class CreateInitialSchema1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'date_of_birth',
            type: 'date',
            isNullable: true
          },
          {
            name: 'gender',
            type: 'varchar',
            length: '20',
            isNullable: true
          },
          {
            name: 'bio',
            type: 'text',
            length: '150',
            isNullable: true
          },
          {
            name: 'profile_photo_url',
            type: 'varchar',
            length: '500',
            isNullable: true
          },
          {
            name: 'profile_photos',
            type: 'jsonb',
            isNullable: true,
            default: '[]'
          },
          {
            name: 'location',
            type: 'point'
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '20'
          },
          {
            name: 'radius_preference',
            type: 'integer',
            default: 10
          },
          {
            name: 'age_range_min',
            type: 'integer',
            default: 25
          },
          {
            name: 'age_range_max',
            type: 'integer',
            default: 45
          },
          {
            name: 'interests',
            type: 'jsonb',
            default: '[]'
          },
          {
            name: 'languages',
            type: 'jsonb',
            default: '[]'
          },
          {
            name: 'dietary_restrictions',
            type: 'jsonb',
            default: '[]'
          },
          {
            name: 'verified_at',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'verification_status',
            type: 'varchar',
            length: '20',
            default: "'pending'"
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()'
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
            isNullable: true
          }
        ]
      }),
      true
    );
    
    // Create restaurants table
    await queryRunner.createTable(
      new Table({
        name: 'restaurants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'address_line1',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'address_line2',
            type: 'varchar',
            length: '255',
            isNullable: true
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'country',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '20'
          },
          {
            name: 'location',
            type: 'point'
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true
          },
          {
            name: 'website_url',
            type: 'varchar',
            length: '500',
            isNullable: true
          },
          {
            name: 'cuisine_type',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'price_range',
            type: 'varchar',
            length: '20'
          },
          {
            name: 'capacity',
            type: 'integer'
          },
          {
            name: 'partner_status',
            type: 'varchar',
            length: '20',
            default: "'pending'"
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()'
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true
          }
        ]
      }),
      true
    );
    
    // Create indexes
    await queryRunner.createIndex('users', new TableIndex({
      name: 'idx_users_location',
      columnNames: ['location'],
      isSpatial: true
    }));
    
    await queryRunner.createIndex('users', new TableIndex({
      name: 'idx_users_email',
      columnNames: ['email'],
      isUnique: true
    }));
    
    await queryRunner.createIndex('restaurants', new TableIndex({
      name: 'idx_restaurants_location',
      columnNames: ['location'],
      isSpatial: true
    }));
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('restaurants');
  }
}
```

---

## 4. Integration Components

### 4.1 Payment Integration

#### StripeService
```typescript
// src/services/PaymentService.ts
class StripePaymentService {
  private stripe: Stripe;
  private webhookSecret: string;
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    });
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  }
  
  async createPaymentIntent(amount: number, currency: string, description: string): Promise<PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      automatic_payment_methods: { enabled: true }
    });
  }
  
  async createCustomer(user: User): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: { userId: user.id }
    });
    return customer.id;
  }
  
  async createSubscription(customerId: string, priceId: string): Promise<Subscription> {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent']
    });
  }
  
  async handleWebhook(event: Stripe.Event): Promise<void> {
    const sig = event.request?.headers?.['stripe-signature'];
    
    let stripeEvent: Stripe.Event;
    
    try {
      stripeEvent = this.stripe.webhooks.constructEvent(
        event.body,
        sig!,
        this.webhookSecret
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
    
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(stripeEvent.data.object as PaymentIntent);
        break;
      case 'charge.refunded':
        await this.handleRefund(stripeEvent.data.object as Charge);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailure(stripeEvent.data.object as Invoice);
        break;
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }
  }
  
  private async handlePaymentSuccess(paymentIntent: PaymentIntent): Promise<void> {
    const userId = paymentIntent.metadata.userId;
    const packageId = paymentIntent.metadata.packageId;
    const quantity = parseInt(paymentIntent.metadata.quantity || '1');
    
    // Update user package
    await this.userRepository.incrementPackageUnits(userId, packageId, quantity);
    
    // Send confirmation email
    await this.emailService.sendPaymentConfirmation(userId, paymentIntent);
  }
}
```

### 4.2 Image Processing Integration

#### CloudinaryService
```typescript
// src/services/ImageService.ts
class CloudinaryService {
  private cloudinary: any;
  
  constructor() {
    this.cloudinary = cloudinary.v2;
    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }
  
  async uploadImage(file: Buffer, options: UploadOptions = {}): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'lsdn/users',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' }
          ],
          moderation: 'manual',
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(file);
    });
  }
  
  async deleteImage(publicId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId);
  }
  
  async moderateImage(publicId: string): Promise<ModerationResult> {
    return await this.cloudinary.api.update(publicId, {
      moderation_status: 'approved'
    });
  }
  
  async generateVoucherQR(bookingId: string, voucherCode: string): Promise<string> {
    const qrCodeUrl = await QRCode.toDataURL(`${process.env.FRONTEND_URL}/voucher/${bookingId}?code=${voucherCode}`);
    
    const result = await this.cloudinary.uploader.upload(qrCodeUrl, {
      folder: 'lsdn/vouchers',
      public_id: `qr-${bookingId}`,
      resource_type: 'image'
    });
    
    return result.secure_url;
  }
}
```

### 4.3 Email Integration

#### EmailService
```typescript
// src/services/EmailService.ts
class SendGridEmailService {
  private sgMail: any;
  
  constructor() {
    this.sgMail = require('@sendgrid/mail');
    this.sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }
  
  async sendEmail(templateId: string, to: string, data: any): Promise<void> {
    const msg = {
      to,
      from: {
        email: process.env.FROM_EMAIL!,
        name: 'Local Singles Date Night'
      },
      templateId,
      dynamic_template_data: data
    };
    
    await this.sgMail.send(msg);
  }
  
  async sendVerificationEmail(user: User, token: string): Promise<void> {
    await this.sendEmail('d-verification-email', user.email, {
      userName: user.firstName,
      verificationUrl: `${process.env.FRONTEND_URL}/auth/verify?token=${token}`
    });
  }
  
  async sendBookingConfirmation(booking: Booking, user: User): Promise<void> {
    await this.sendEmail('d-booking-confirmation', user.email, {
      userName: user.firstName,
      restaurantName: booking.restaurant.name,
      bookingTime: format(booking.bookingTime, 'PPpp'),
      voucherCode: booking.voucherCode,
      qrCodeUrl: booking.qrCodeUrl
    });
  }
  
  async sendMatchNotification(user: User, candidate: Candidate): Promise<void> {
    await this.sendEmail('d-match-found', user.email, {
      userName: user.firstName,
      candidateName: candidate.user.firstName,
      restaurantName: candidate.restaurant.name,
      bookingTime: format(candidate.bookingTime, 'PPpp')
    });
  }
}
```

---

## 5. Infrastructure Components

### 5.1 Docker Configuration

#### Backend Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 5.2 Environment Configuration

#### Environment Variables
```bash
# .env.example
# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lsdn_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# External Services
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@lsdn.com

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn

# Feature Flags
ENABLE_EMAIL_VERIFICATION=true
ENABLE_IMAGE_MODERATION=true
ENABLE_MATCHING_ALGORITHM=true
```

### 5.3 CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_DB: lsdn_test
          POSTGRES_USER: lsdn_user
          POSTGRES_PASSWORD: lsdn_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:6-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Run linting
        run: |
          cd backend && npm run lint
          cd ../frontend && npm run lint
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test -- --coverage
      
      - name: Build application
        run: |
          cd backend && npm run build
          cd ../frontend && npm run build
        env:
          NODE_ENV: production

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        uses: render-oss/deploy-action@v1.3.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

This component breakdown provides a comprehensive overview of the Local Singles Date Night application's architecture, from frontend UI components to backend services, database models, and infrastructure components. Each component is designed to be modular, testable, and maintainable, following best practices for modern web application development.