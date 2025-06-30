import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, Clock, Currency, Globe, MessageCircle, LineChart } from 'lucide-react';

// Custom Hook for Intersection Observer to trigger animations on scroll
const useIntersectionObserver = (options) => {
	const [isVisible, setIsVisible] = useState(false);
	const targetRef = useRef(null); // The element to observe

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					// Disconnect observer after the first intersection to play animation only once
					observer.disconnect();
				}
			});
		}, options);

		const currentTarget = targetRef.current;
		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget);
			}
		};
	}, [options]); // Re-run effect if options change

	return [targetRef, isVisible];
};

// Main App Component
function App() {
	// State for managing dark mode, initialized from localStorage
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedMode = localStorage.getItem('theme');
		return savedMode === 'dark';
	});

	// Apply dark mode class to HTML body
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDarkMode]);

	// Function to toggle dark mode
	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	return (
		// Conditional styling for the main container based on dark mode
		<div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
			{/* Define custom animations here for demonstration */}
			<style>
				{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.8s ease-out forwards;
      }
      .animate-slideInUp {
        animation: slideInUp 0.8s ease-out forwards;
      }
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      .animate-delay-100 { animation-delay: 0.1s; }
      .animate-delay-200 { animation-delay: 0.2s; }
      .animate-delay-300 { animation-delay: 0.3s; }
      .animate-delay-400 { animation-delay: 0.4s; }
      .animate-delay-500 { animation-delay: 0.5s; }
      .animate-delay-600 { animation-delay: 0.6s; }
      .animate-delay-700 { animation-delay: 0.7s; }
      .animate-delay-800 { animation-delay: 0.8s; }
      `}
			</style>

			{/* Navbar Component, passing toggle function and dark mode state */}
			<Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
			{/* Hero Section Component */}
			<HeroSection isDarkMode={isDarkMode} />
			{/* Features Section Component */}
			<FeaturesSection isDarkMode={isDarkMode} />
			{/* About Section Component */}
			<AboutSection isDarkMode={isDarkMode} />

			{/* Comparison Section Component */}
			<ComparisonSection isDarkMode={isDarkMode} />
			<SeamlessIntegrations isDarkMode={isDarkMode} />

			{/* FAQ Section Component */}
			<FAQSection isDarkMode={isDarkMode} />
			<PricingSection />
			{/* Footer Component */}
			<Footer isDarkMode={isDarkMode} />
		</div>
	);
}

// Navbar Component - Updated for Black & White theme with centered logo and new name
function Navbar({ toggleDarkMode, isDarkMode }) {
	return (
		<nav className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} animate-fadeIn`}>
			<div className='container mx-auto px-4 py-4 flex items-center'>
				{/* Empty div to push the center logo to the right and balance the button on the right */}
				<div className='flex-grow basis-1/3'></div>

				{/* Logo - Updated to Nimble AI and centered */}
				<a href='#' className='flex items-center space-x-2 flex-grow justify-center basis-1/3'>
					{/* Removed image import and replaced with text logo */}
					<img src={require('./logo.png')} alt='Nimble AI Logo' className={`h-12 w-auto object-contain ${isDarkMode ? 'logo-invert' : ''}`} />
				</a>
				{/* Dark Mode Toggle Button */}
				<div className='flex-grow flex justify-end basis-1/3'>
					<button
						onClick={toggleDarkMode}
						className={`p-2 rounded-full transition-colors duration-300 ${
							isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
						}`}
						aria-label='Toggle Dark Mode'
					>
						{isDarkMode ? (
							// Sun icon for light mode
							<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M12 3v1m0 16v1m9-9h1M2 12h1m15.325-4.475l-.707-.707M6.382 17.618l-.707-.707M17.618 6.382l-.707-.707M6.382 6.382l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
								></path>
							</svg>
						) : (
							// Moon icon for dark mode
							<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
								></path>
							</svg>
						)}
					</button>
				</div>
			</div>
		</nav>
	);
}

// Hero Section Component - Updated for Black & White theme with animations and centered content

function HeroSection({ isDarkMode }) {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showInput, setShowInput] = useState(false); // NEW

	const handleContactUs = (e) => {
		e.preventDefault();
		if (!email) {
			setStatus('Please enter your email address.');
			return;
		}

		setIsLoading(true);

		const payload = { userEmail: email };

		fetch('https://a804judny2.execute-api.us-east-1.amazonaws.com/auto/sendEmail', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})
			.then(async (response) => {
				if (response.ok) {
					setStatus('Message sent successfully!');
					setEmail('');
				} else {
					const errorData = await response.json();
					console.error('Failed to send email:', errorData);
					setStatus('Failed to send message. Please try again.');
				}
			})
			.catch((error) => {
				console.error('Error sending email:', error);
				setStatus('An error occurred. Please try again later.');
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<section className={`py-10 md:py-14 overflow-hidden relative px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-white to-gray-50'}`}>
			<div className='container mx-auto flex flex-col items-center justify-center text-center z-10'>
				<h1
					className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 ${
						isDarkMode ? 'text-gray-100' : 'text-gray-900'
					}`}
				>
					Instant Customer Resolutions <br className='hidden sm:inline' /> Through Intelligent Chat Service
				</h1>
				<p className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
					Deliver real-time support with a human-like touch — our intelligent chat service understands, responds, and resolves just like your best
					agents.
				</p>

				{/* Button Row */}
				<div className='flex items-center justify-center gap-4 mb-6'>
					{/* Start for Free button with smooth slide */}
					<button
						className={`px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-500 transform ${showInput ? '-translate-x-3' : ''} ${
							isDarkMode ? 'bg-green-400 text-gray-900 hover:bg-green-300' : 'bg-green-600 text-white hover:bg-green-700'
						}`}
					>
						Start for Free
					</button>

					{/* Contact Us + input wrapper with smooth expand */}
					<div
						className={`flex items-center rounded-full overflow-hidden transition-all duration-500 ${
							showInput ? 'w-[320px]' : 'w-[140px]'
						} h-[48px] shadow-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
					>
						{/* Input Field */}
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Your Email'
							className={`transition-all duration-500 ease-in-out text-sm px-4 py-2 outline-none border-none ${
								showInput ? 'w-full opacity-100' : 'w-0 opacity-0'
							} ${isDarkMode ? 'bg-gray-900 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
						/>

						{/* Contact Us Button (same height as input) */}
						<button
							onClick={(e) => {
								if (!showInput) {
									setShowInput(true);
								} else {
									handleContactUs(e);
								}
							}}
							type='button'
							className={`whitespace-nowrap h-full px-4 text-sm font-semibold transition-colors ${
								isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-800 hover:text-black'
							}`}
						>
							{isLoading ? 'Sending...' : 'Contact Us'}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

// Features Section Component - Updated for Black & White theme with NEW creative icons
function FeaturesSection({ isDarkMode }) {
	const sectionBg = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
	const cardBg = isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-800';
	const iconColor = isDarkMode ? 'text-green-400' : 'text-green-600';

	const features = [
		{
			icon: <CheckCircle className={`w-5 h-5 ${iconColor}`} />,
			text: 'Instant Support: Handle 80% of queries instantly, cutting wait time by 60%',
		},
		{
			icon: <Clock className={`w-5 h-5 ${iconColor}`} />,
			text: '24/7 Availability: Provide support around the clock',
		},
		{
			icon: <Currency className={`w-5 h-5 ${iconColor}`} />,
			text: 'Cost Efficiency: Reduce support expenses by 70%',
		},
		{
			icon: <Globe className={`w-5 h-5 ${iconColor}`} />,
			text: 'Multilingual Capability: Serve customers worldwide',
		},
		{
			icon: <MessageCircle className={`w-5 h-5 ${iconColor}`} />,
			text: 'Human-like Interaction: Escalate complex issues',
		},
		{
			icon: <LineChart className={`w-5 h-5 ${iconColor}`} />,
			text: 'Customer Insights: Real-time analytics',
		},
	];

	return (
		<section className={`py-20 ${sectionBg}`}>
			<div className='container mx-auto px-6 flex flex-col md:flex-row items-center gap-12'>
				{/* Chat Mockup */}
				<ComparisonSection isDarkMode={isDarkMode} />

				{/* Text Content */}
				<div className='w-full md:w-1/2'>
					<h2 className='text-3xl sm:text-4xl font-bold mb-4 leading-snug'>
						Assist customers on their journeys with <span className='text-blue-600'>Live Chat</span>
					</h2>
					<p className='mb-6 text-base sm:text-lg'>
						Offer a clear route for customer questions and provide immediate answers through a lightweight live chat widget.
					</p>
					<ul className='space-y-4'>
						{features.map((feature, index) => (
							<li key={index} className='flex items-start gap-3'>
								{feature.icon}
								<span>{feature.text}</span>
							</li>
						))}
					</ul>
					<a href='#' className='inline-block mt-8 text-blue-600 hover:underline font-medium transition'>
						Learn more about Live Chat →
					</a>
				</div>
			</div>
		</section>
	);
}

const pricingPlans = [
	{
		name: 'Starter',
		price: '₹2,400',
		duration: '/mo.',
		description: 'Ideal for small businesses focused on enhancing customer satisfaction via live chat support.',
		includes: 'Includes up to 3 agents',
		features: ['100 Billable conversations', 'Basic analytics', 'Live visitors list', 'Operating hours'],
		buttonText: 'Selected',
		selected: true,
	},
	{
		name: 'Growth',
		price: '₹4,900',
		duration: '/mo.',
		tag: 'POPULAR',
		description: 'Ideal for teams of all sizes prioritizing customer service as their competitive advantage.',
		includes: 'Includes up to 5 agents',
		features: ['Up to 2,000 Billable conversations', 'Advanced analytics', 'Tidio power features', 'No Tidio branding (add-on)', 'Permissions'],
		buttonText: 'Select plan',
	},
	{
		name: 'Plus',
		price: '₹62,000',
		duration: '/mo.',
		description: 'For businesses requiring better limits, additional integrations, advanced features, and premium support.',
		includes: 'Includes up to 10 agents',
		features: ['Custom quota of Billable conversations', 'Dedicated Success Manager', 'Custom branding', 'Multisite', 'Departments'],
		buttonText: 'Contact sales',
	},
	{
		name: 'Premium',
		price: '₹2,48,000',
		duration: '/mo.',
		description: 'For more complex businesses',
		includes: 'Unlimited agents',
		features: [
			'Lyro as a managed service',
			'Guaranteed 50% Lyro AI resolution rate',
			'Priority Service + Premium Support',
			'Super admin role',
			'Analysis & monitoring',
		],
		buttonText: 'Contact sales',
	},
];

function PricingSection({ isDarkMode }) {
	return (
		<section className={`py-20 px-4 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
			<div className='max-w-7xl mx-auto text-center mb-12'>
				<h2 className='text-4xl font-extrabold mb-4'>Plans that grow with you</h2>
				<p className='text-lg max-w-2xl mx-auto'>Choose a plan that fits your business size, needs, and goals.</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto'>
				{pricingPlans.map((plan, idx) => (
					<div
						key={idx}
						className={`rounded-xl p-6 border-2 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
							plan.selected ? 'border-blue-500' : isDarkMode ? 'border-gray-700 hover:border-green-400' : 'border-gray-200 hover:border-green-600'
						}`}
					>
						{/* Tag */}
						{plan.tag && <span className='inline-block mb-2 px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full'>{plan.tag}</span>}

						{/* Top Content */}
						<div className='flex-grow flex flex-col'>
							<h3 className='text-xl font-semibold mb-1'>{plan.name}</h3>
							<p className='text-sm mb-4'>{plan.description}</p>

							<div className='text-3xl font-bold mb-1'>
								{plan.price} <span className='text-base font-medium'>{plan.duration}</span>
							</div>
							<p className='text-xs text-gray-500 mb-4'>{plan.includes}</p>

							{/* Feature list */}
							<ul className='text-sm space-y-2 text-left mt-2'>
								{plan.features.map((feature, i) => (
									<li key={i} className='flex items-start gap-2'>
										<svg
											className='w-5 h-5 flex-shrink-0 text-green-500'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											viewBox='0 0 24 24'
										>
											<path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
										</svg>
										{feature}
									</li>
								))}
							</ul>
						</div>

						{/* Bottom Button Block */}
						<div className='mt-6'>
							<button
								disabled={plan.selected}
								className={`w-full py-3 rounded-md font-medium text-sm transition transform duration-300 ${
									plan.selected ? 'bg-gray-100 text-gray-400 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
								}`}
							>
								{plan.buttonText}
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

const SeamlessIntegrations = ({ isDarkMode }) => {
	const integrations = [
		{ src: '/integrations/mailchimp.png', bg: 'bg-yellow-200', alt: 'Mailchimp' },
		{ src: '/integrations/hubspot.png', bg: 'bg-rose-100', alt: 'HubSpot' },
		{ src: '/integrations/wordpress.png', bg: 'bg-blue-100', alt: 'WordPress' },
		{ src: '/integrations/shopify.png', bg: 'bg-green-100', alt: 'Shopify' },
		{ src: '/integrations/squarespace.png', bg: 'bg-violet-100', alt: 'Squarespace' },
		{ src: '/integrations/zendesk.png', bg: 'bg-gray-100', alt: 'Zendesk' },
		{ src: '/integrations/other.png', bg: 'bg-orange-100', alt: 'Other' },
	];

	return (
		<section className={`py-16 px-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
			<div className='max-w-5xl mx-auto text-center'>
				<h2 className='text-3xl sm:text-4xl font-extrabold mb-6'>Seamless integration with your workflow and processes.</h2>

				{/* Icons */}
				<div className='flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-6 md:p-6'>
					{integrations.map((item, idx) => (
						<div
							key={idx}
							className={`${item.bg} rounded-full w-20 h-20 flex items-center justify-center`}
							style={{ position: 'absolute', left: `${idx * 60}px`, border: '5px solid #fff' }}
						>
							<img src={item.src} alt={item.alt} className='w-10 h-10 object-contain' />
						</div>
					))}
				</div>

				<p className='text-sm text-gray-500 dark:text-gray-400'>and more than 120+ tools to integrate</p>
			</div>
		</section>
	);
};

const IntegrationCard = ({ icon, label, isDarkMode }) => (
	<div
		className={`flex flex-col items-center justify-center text-center gap-2 rounded-xl border backdrop-blur-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] px-4 py-5 min-w-[100px] ${
			isDarkMode
				? 'bg-white/5 border-white/10 text-gray-100 shadow-[0_4px_12px_rgba(255,255,255,0.05)] hover:shadow-[0_10px_25px_rgba(255,255,255,0.1)]'
				: 'bg-white/50 border-gray-200 text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]'
		}`}
	>
		<div className='mb-1'>{icon}</div>
		<span className='text-xs font-medium tracking-wide opacity-80'>{label}</span>
	</div>
);

// About Section Component (existing) with animations and centered content
function AboutSection({ isDarkMode }) {
	const [aboutRef, aboutVisible] = useIntersectionObserver({ threshold: 0.1 });

	return (
		<section
			ref={aboutRef}
			className={`py-12 sm:py-20 transition-opacity duration-1000 ${aboutVisible ? 'opacity-100' : 'opacity-0'} ${
				isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
			}`}
		>
			<div className='container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12'>
				<div className='md:w-1/2 text-center animate-slideInUp'>
					<span
						className={`inline-block text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full mb-4 sm:mb-6 ${
							isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
						}`}
					>
						About Nimble AI
					</span>
					<h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
						Nimble AI empowers your business with cutting-edge AI solutions, driving unparalleled efficiency and strategic advantage.
					</h2>
					<p className={`text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
						At Nimble AI, we harness the power of advanced artificial intelligence to drive business transformation. Our cutting-edge solutions:
						Elevate customer support with intelligent, responsive systems Automate complex workflows to boost efficiency and reduce manual effort
						Implement intelligent business logic for smarter, faster decision-making Founded by IIT Bombay alumni with over 8 years of deep
						expertise in AI, machine learning, and related domains, our team combines technical excellence with real-world insights. This ensures
						Nimble AI consistently delivers forward-thinking, impactful innovations that keep our clients ahead of the curve.
					</p>
				</div>
				<div className='md:w-1/2 grid grid-cols-1 gap-4 sm:gap-6 animate-fadeIn animate-delay-200 max-w-xs sm:max-w-sm mx-auto'>
					<InfoCard title='Beta Access:' value='Q2, 2025' isDarkMode={isDarkMode} />
					<InfoCard title='Implementation:' value='Founder-led Onboarding' isDarkMode={isDarkMode} />
					<InfoCard
						title='Your First Demo Is on Us – Try It Free!'
						// value='Your First Demo Is on Us – Try It Free!'
						// icon={
						// 	<svg
						// 		className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
						// 		fill='none'
						// 		stroke='currentColor'
						// 		viewBox='0 0 24 24'
						// 		xmlns='http://www.w3.org/2000/svg'
						// 	>
						// 		<path
						// 			strokeLinecap='round'
						// 			strokeLinejoin='round'
						// 			strokeWidth='2'
						// 			d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v4m-6-2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
						// 		></path>
						// 	</svg>
						// }
						isDarkMode={isDarkMode}
					/>
				</div>
			</div>
		</section>
	);
}

// Reusable Info Card Component for About Section (existing)
const InfoCard = ({ title, value, icon, isDarkMode }) => (
	<div
		className={`p-4 sm:p-6 rounded-xl shadow-md border flex items-center justify-between animate-slideInUp ${
			isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
		}`}
	>
		<div className='flex items-center gap-1.5 sm:gap-2'>
			{icon}
			<span className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{title}</span>
		</div>
		<span className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{value}</span>
	</div>
);

const messages = [
	{ type: 'ai', text: 'Hello! How can I assist you today?' },
	{ type: 'customer', text: 'How do I create a Return Request?' },
	{
		type: 'ai',
		text: 'You can create a Return in three simple steps: 1) Tap on MyOrders 2) Choose the item to be Returned 3) Enter details requested and create a return request',
	},
	{ type: 'customer', text: 'Where should I self-ship the Returns?' },
	{
		type: 'ai',
		text: 'You can send the return to any one of the following returns processing facilities listed below. Please ensure that you specify the name of the seller you purchased the products from (You can find the seller name on your order invoice) and dispatch the package to the address listed below. Kindly do not send it to any other address as the return package would not be treated as accepted."',
	},
	{ type: 'customer', text: 'I have created a Return request. When will I get the refund' },
	{
		type: 'ai',
		text: "Refund will be initiated upon successful pickup as per the Returns Policy. The refund amount is expected to reflect in the customer account within the following timelines: NEFT - 1 to 3 business days post refund initiation, Cyntra Credit - Instant, Online Refund – 7 to 10 days post refund initiation, depending on your bank partner, 'PhonePe wallet' – Instant",
	},
];

function ComparisonSection({ isDarkMode }) {
	const [visibleMessages, setVisibleMessages] = useState([]);
	const [typingIndex, setTypingIndex] = useState(-1);
	const hasBeenVisibleRef = useRef(false);
	const chatContainerRef = useRef(null);

	const useIntersectionObserver = ({ threshold = 0.1 } = {}) => {
		const [entry, setEntry] = useState(null);
		const observer = useRef(null);

		const ref = useCallback(
			(node) => {
				if (observer.current) observer.current.disconnect();
				observer.current = new IntersectionObserver(([entry]) => setEntry(entry), {
					threshold,
				});
				if (node) observer.current.observe(node);
			},
			[threshold]
		);

		return [ref, entry?.isIntersecting || false];
	};

	const [intersectionRef, comparisonVisible] = useIntersectionObserver();

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
		}
	}, [visibleMessages, typingIndex]);

	const startChatAnimation = () => {
		let index = 0;
		let isCancelled = false;

		const showNextMessage = () => {
			if (isCancelled || index >= messages.length) return;
			const msg = messages[index];

			if (msg.type === 'ai') {
				setTypingIndex(index);
				setTimeout(() => {
					if (isCancelled) return;
					setVisibleMessages((prev) => [...prev, msg]);
					setTypingIndex(-1);
					index++;
					setTimeout(showNextMessage, 700);
				}, 700);
			} else {
				setTimeout(() => {
					if (isCancelled) return;
					setVisibleMessages((prev) => [...prev, msg]);
					index++;
					setTimeout(showNextMessage, 700);
				}, 500);
			}
		};

		const initTimeout = setTimeout(showNextMessage, 300);

		return () => {
			isCancelled = true;
			clearTimeout(initTimeout);
		};
	};

	useEffect(() => {
		let timeout;
		if (comparisonVisible && !hasBeenVisibleRef.current) {
			hasBeenVisibleRef.current = true;
			timeout = setTimeout(() => {
				setVisibleMessages([]);
				setTypingIndex(-1);
				startChatAnimation();
			}, 1000);
		} else if (!comparisonVisible && hasBeenVisibleRef.current) {
			hasBeenVisibleRef.current = false;
		}
		return () => clearTimeout(timeout);
	}, [comparisonVisible]);

	return (
		<section
			ref={intersectionRef}
			className={`py-12 sm:py-20 transition-opacity duration-1000 ${comparisonVisible ? 'opacity-100' : 'opacity-0'} ${
				isDarkMode ? 'bg-gray-900' : 'bg-white'
			}`}
		>
			<div className='w-[450px] container mx-auto px-4 text-center'>
				<div className='flex flex-col lg:flex-row justify-center items-stretch gap-6 sm:gap-8'>
					<div
						className={`w-full rounded-xl shadow-lg p-4 sm:p-6 flex flex-col animate-fadeIn max-w-md mx-auto ${
							isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
						}`}
					>
						<h3
							className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center flex items-center justify-center gap-1.5 sm:gap-2 ${
								isDarkMode ? 'text-gray-100' : 'text-gray-900'
							}`}
						>
							<span className={`text-2xl sm:text-3xl ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>◎</span> Nimble AI Chat
						</h3>

						<div
							ref={chatContainerRef}
							className='space-y-3 h-[400px] w-full overflow-y-auto pr-1 scrollbar-none'
							style={{ scrollbarWidth: 'none' }}
						>
							{visibleMessages.map((msg, idx) =>
								msg.type === 'ai' ? (
									<AIMessage key={idx} text={msg.text} isDarkMode={isDarkMode} index={idx} />
								) : (
									<CustomerMessage key={idx} text={msg.text} isDarkMode={isDarkMode} index={idx} />
								)
							)}
							{typingIndex !== -1 && <TypingIndicator isDarkMode={isDarkMode} />}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

const CustomerMessage = ({ text, isDarkMode, index }) => {
	const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	return (
		<div className='flex justify-end animate-slideInDown' style={{ animationDelay: `${index * 0.3}s`, animationFillMode: 'both' }}>
			<div className={`p-2 sm:p-3 rounded-lg max-w-[80%]  shadow-sm ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-900 text-white'}`}>
				<p className='text-xs sm:text-sm text-left w-full'>{text}</p>
				<div className='w-full text-[10px] text-gray-400 mb-1 self-end text-right'>[{timestamp}]</div>
			</div>
		</div>
	);
};

const AIMessage = ({ text, link, isDarkMode, index }) => {
	const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	return (
		<div className='flex justify-start animate-slideInDown' style={{ animationDelay: `${index * 0.3}s`, animationFillMode: 'both' }}>
			<div
				className={`p-2 sm:p-3 rounded-lg max-w-[80%] text-left shadow-sm border ${
					isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-200'
				}`}
			>
				<p className='text-xs sm:text-sm'>
					{text}
					{link && (
						<a href={link} className='text-blue-600 hover:underline ml-1 text-xs sm:text-sm' target='_blank' rel='noopener noreferrer'>
							refer to this article.
						</a>
					)}
				</p>
				<span className=' text-[10px] text-gray-400'>[{timestamp}]</span>
			</div>
		</div>
	);
};

const TypingIndicator = ({ isDarkMode }) => (
	<div className='flex justify-start animate-fadeIn'>
		<div
			className={`p-2 sm:p-3 rounded-lg max-w-[80%] shadow-sm border text-left ${
				isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-200'
			}`}
		>
			<div className='flex items-center space-x-1'>
				<span className='w-1.5 h-1.5 bg-current rounded-full animate-bounce' />
				<span className='w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-100' />
				<span className='w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-200' />
			</div>
		</div>
	</div>
);

// FAQ Section Component (existing) with animations
function FAQSection({ isDarkMode }) {
	const [faqRef, faqVisible] = useIntersectionObserver({ threshold: 0.1 });

	const faqs = [
		{
			question: 'What is Nimble AI?',
			answer: 'Nimble AI is an intelligent AI agent designed to automate customer interactions, enhance response accuracy, and dynamically update knowledge graphs for seamless workflow integration.',
		},
		{
			question: 'What platforms does it support?',
			answer: 'Nimble AI is designed to integrate seamlessly with various popular customer support and CRM platforms. Specific integrations will be announced closer to launch.',
		},
		// {
		// 	question: 'Who can use Nimble AI?',
		// 	answer: 'Nimble AI is built for businesses of all sizes looking to enhance their customer support, streamline operations, and leverage AI for better customer interactions.',
		// },
		{
			question: 'What kind of data does Nimble AI use for training?',
			answer: 'Nimble AI is trained on a diverse range of anonymized and aggregated customer interaction data to ensure broad applicability and high accuracy, while strictly adhering to privacy protocols.',
		},
		{
			question: 'How does Nimble AI handle sensitive customer information?',
			answer: 'We prioritize data security and privacy. Nimble AI employs robust encryption and anonymization techniques, and all sensitive information is handled in compliance with industry-leading security standards.',
		},
		{
			question: 'Can Nimble AI integrate with my existing CRM system?',
			answer: 'Yes, Nimble AI is built with flexible APIs and connectors to seamlessly integrate with most popular CRM platforms, ensuring a smooth transition and enhanced functionality.',
		},
		{
			question: 'What support is available after implementation?',
			answer: 'We offer comprehensive support packages, including dedicated account management, technical assistance, and regular updates to ensure optimal performance and continuous improvement of your AI solutions.',
		},
		// {
		// 	question: 'How long does it take to implement Nimble AI?',
		// 	answer: 'Implementation time varies depending on your specific needs and existing infrastructure, but our team works closely with you to ensure a swift and efficient setup, typically ranging from a few weeks to a couple of months.',
		// },
	];

	return (
		<section
			ref={faqRef}
			className={`py-12 sm:py-20 transition-opacity duration-1000 ${faqVisible ? 'opacity-100' : 'opacity-0'} ${
				isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
			}`}
		>
			<div className='container mx-auto px-4 text-center'>
				<span
					className={`inline-block text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full mb-4 sm:mb-6 animate-fadeIn ${
						isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
					}`}
				>
					FAQ
				</span>
				<h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 animate-slideInUp ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
					Frequently Asked Questions
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start max-w-lg sm:max-w-4xl mx-auto'>
					{faqs.map((faq, index) => (
						<FAQItem key={index} question={faq.question} answer={faq.answer} delay={index * 100} isDarkMode={isDarkMode} />
					))}
				</div>
			</div>
		</section>
	);
}

// Reusable FAQ Item Component with animation
function FAQItem({ question, answer, delay, isDarkMode }) {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<div
			className={`p-4 sm:p-6 rounded-xl shadow-md border text-left cursor-pointer transition-all duration-300 hover:shadow-lg animate-slideInUp ${
				isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
			}`}
			style={{ animationDelay: `${delay}ms` }}
		>
			<div className='flex justify-between items-center' onClick={() => setIsOpen(!isOpen)}>
				<h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{question}</h3>
				<svg
					className={`w-5 h-5 sm:w-6 sm:h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${
						isDarkMode ? 'text-gray-200' : 'text-gray-700'
					}`}
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
				</svg>
			</div>
			{isOpen && (
				<p className={`mt-3 text-sm sm:text-base transition-all duration-300 ease-in-out ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
					{answer}
				</p>
			)}
		</div>
	);
}

// Footer Component - Updated for Black & White theme to match the screenshot
function Footer({ isDarkMode }) {
	const [footerRef, footerVisible] = useIntersectionObserver({
		threshold: 0.1,
	});

	return (
		<footer
			ref={footerRef}
			className={`py-8 sm:py-10 border-t transition-opacity duration-1000 ${footerVisible ? 'opacity-100' : 'opacity-0'} ${
				isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'
			}`}
		>
			<div className='container mx-auto px-4 text-center'>
				<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4 justify-center items-center'>
					{/* "Write Us" button updated to mailto link */}
					<a
						href='mailto:enquire@nimble.ai'
						className={`px-4 py-1.5 sm:px-6 sm:py-2 font-semibold rounded-full shadow-lg transition duration-300 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
							isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-900 text-white hover:bg-gray-700'
						}`}
					>
						<svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
							/>
						</svg>
						Write Us
					</a>
				</div>

				{/* Follow Us */}
				<div className='flex flex-col items-center space-y-1.5 sm:space-y-2 mb-3 sm:mb-4'>
					<span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Follow Us</span>
					<a
						href='https://www.linkedin.com/company/nimbleai-in/'
						target='_blank'
						rel='noopener noreferrer'
						className={`${isDarkMode ? 'text-gray-200 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-300`}
					>
						<svg className='w-6 h-6 sm:w-8 sm:h-8' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
							<path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
						</svg>
					</a>
				</div>

				{/* Copyright and Slogan */}
				<div
					className={`flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm border-t pt-4 sm:pt-6 mt-4 sm:mt-6 ${
						isDarkMode ? 'text-gray-300 border-gray-700' : 'text-gray-600 border-gray-200'
					}`}
				>
					<p className='mb-1.5 sm:mb-0'>&copy; 2025, Nimble AI, Inc</p>
					<p>100x your productivity while supporting customers!</p>
				</div>
			</div>
		</footer>
	);
}

export default App;
