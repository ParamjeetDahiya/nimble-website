import React, { useState, useEffect, useRef } from 'react';
import ChatWidget from './components/ChatWidget';
import FeaturesSection from './components/FeaturesSection';
import HeroSection from './components/HeroSection';

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

	// State for modal and form
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		mobile: '',
		plan: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState('');

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

	// Function to handle plan selection
	const handlePlanSelect = (plan) => {
		setSelectedPlan(plan);
		setFormData((prev) => ({ ...prev, plan: plan.name }));
		setIsModalOpen(true);
		setSubmitSuccess('');
	};

	// Function to handle form submission
	const handleFormSubmit = (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitSuccess('');
		fetch('https://a804judny2.execute-api.us-east-1.amazonaws.com/auto/sendEmail', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userEmail: formData.email,
				name: formData.name,
				mobile: formData.mobile,
				plan: formData.plan,
			}),
		})
			.then((response) => {
				if (response.ok) {
					setSubmitSuccess('Thank you! Your request has been submitted.');
					setFormData({ name: '', email: '', mobile: '', plan: '' });
					setSelectedPlan(null);
				} else {
					setSubmitSuccess('Failed to submit. Please try again.');
				}
			})
			.catch(() => {
				setSubmitSuccess('An error occurred. Please try again later.');
			})
			.finally(() => {
				setIsSubmitting(false);
			});
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

			{/* Comparison Section Component */}
			{/* <ComparisonSection isDarkMode={isDarkMode} /> */}
			<SeamlessIntegrations isDarkMode={isDarkMode} />

			{/* FAQ Section Component */}
			<FAQSection isDarkMode={isDarkMode} />
			<PricingSection isDarkMode={isDarkMode} onPlanSelect={handlePlanSelect} />

			{/* About Section Component */}
			<AboutSection isDarkMode={isDarkMode} />

			{/* Footer Component */}
			<Footer isDarkMode={isDarkMode} />

			{/* Plan Selection Modal */}
			{isModalOpen && (
				<PlanSelectionModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					selectedPlan={selectedPlan}
					formData={formData}
					setFormData={setFormData}
					onSubmit={handleFormSubmit}
					isDarkMode={isDarkMode}
					isSubmitting={isSubmitting}
					submitSuccess={submitSuccess}
				/>
			)}

			{/* Floating Chat Widget */}
			<ChatWidget isDarkMode={isDarkMode} />
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

const pricingPlans = [
	{
		name: 'Starter',
		price: '₹0',
		duration: '/mo.',
		description: 'Ideal for solo entrepreneurs and small businesses.',
		includes: 'Includes 1 agent',
		features: ['20 conversations', '1 integration', 'Live visitors list', 'Operating hours'],
		buttonText: 'Select plan',
	},
	{
		name: 'Growth',
		price: '₹3,900',
		duration: '/mo.',
		// tag: 'POPULAR',
		description: 'Ideal for teams of all sizes prioritizing customer service as their competitive advantage.',
		includes: 'Includes 1 agent',
		features: ['Up to 2,000 Billable conversations', '2 integrations', 'Advanced analytics', 'No Nimble AI branding (add-on)', 'Permissions'],
		buttonText: 'Select plan',
	},
	{
		name: 'Plus',
		price: '₹30,000',
		duration: '/mo.',
		description: 'For businesses requiring better limits, additional integrations, advanced features, and premium support.',
		includes: 'Includes up to 5 agents',
		features: ['Up to 20,000 Billable conversations', '2 integrations', 'Dedicated Success Manager', 'Custom branding', 'Departments'],
		buttonText: 'Select plan',
	},
	{
		name: 'Premium',
		price: '₹2,48,000',
		duration: '/mo.',
		description: 'For more complex businesses',
		includes: 'Unlimited agents',
		features: [
			'Guaranteed 50% Nimble AI resolution rate',
			'Priority Service + Premium Support',
			'Analysis & monitoring',
			'Dedicated Success Manager',
			'Custom branding',
			'Departments',
		],
		buttonText: 'Select plan',
	},
];

function PricingSection({ isDarkMode, onPlanSelect }) {
	return (
		<section id='pricing-section' className={`py-20 px-4 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
			<div className='max-w-7xl mx-auto text-center mb-12'>
				<h2 className='text-4xl font-extrabold mb-4'>Plans that you grow with</h2>
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
								onClick={() => onPlanSelect(plan)}
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
		{ src: require('./integrations/mailchimp.png'), bg: 'bg-yellow-200', alt: 'Mailchimp' },
		{ src: require('./integrations/hubspot.png'), bg: 'bg-rose-100', alt: 'HubSpot' },
		{ src: require('./integrations/wordpress.png'), bg: 'bg-blue-100', alt: 'WordPress' },
		{ src: require('./integrations/shopify.png'), bg: 'bg-green-100', alt: 'Shopify' },
		{ src: require('./integrations/squarespace.png'), bg: 'bg-violet-100', alt: 'Squarespace' },
		{ src: require('./integrations/zendesk.png'), bg: 'bg-gray-100', alt: 'Zendesk' },
		// { src: require('./integrations/other.png'), bg: 'bg-orange-100', alt: 'Other' },
	];

	return (
		<section className={`py-16 px-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
			<div className='max-w-5xl mx-auto text-center'>
				<h2 className='text-3xl sm:text-4xl font-extrabold mb-6'>Seamless integration with your workflow and processes.</h2>

				{/* Icons */}
				<div className='flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-6 md:p-6'>
					{integrations.map((item, idx) => (
						<div key={idx} className={`${item.bg} rounded-full w-20 h-20 flex items-center justify-center border-4 border-white`}>
							<img src={item.src} alt={item.alt} className='w-10 h-10 object-contain' />
						</div>
					))}
				</div>

				{/* <p className='text-sm text-gray-500 dark:text-gray-400'>and more than 120+ tools to integrate</p> */}
			</div>
		</section>
	);
};

// About Section Component (existing) with animations and centered content
function AboutSection({ isDarkMode }) {
	const [aboutRef, aboutVisible] = useIntersectionObserver({ threshold: 0.1 });
	const [open, setOpen] = React.useState(false);

	return (
		<section
			ref={aboutRef}
			className={`py-12 sm:py-20 transition-opacity duration-1000 ${aboutVisible ? 'opacity-100' : 'opacity-0'} ${
				isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
			}`}
		>
			<div className='container mx-auto px-4 flex flex-col items-center justify-center gap-8 md:gap-12'>
				<div className='w-full flex flex-col items-center'>
					<button
						onClick={() => setOpen((v) => !v)}
						className={`inline-block text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full mb-4 sm:mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-300 ${
							isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
						aria-expanded={open}
						aria-controls='about-nimble-content'
					>
						About Nimble AI
						<svg
							className={`w-4 h-4 ml-2 inline-block transform transition-transform duration-300 ${open ? 'rotate-180' : ''} ${
								isDarkMode ? 'text-gray-200' : 'text-gray-700'
							}`}
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
						</svg>
					</button>
				</div>
				{open && (
					<div id='about-nimble-content' className='w-full flex flex-col items-center justify-center gap-8 md:gap-12'>
						<div className='w-full max-w-2xl text-center animate-slideInUp'>
							<h2
								className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 sm:mb-6 ${
									isDarkMode ? 'text-gray-100' : 'text-gray-900'
								}`}
							>
								Nimble AI empowers your business with cutting-edge AI solutions, driving unparalleled efficiency and strategic advantage.
							</h2>
							<div className={`text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
								<p className='mb-2'>
									At Nimble AI, we harness the power of advanced artificial intelligence to enable true business transformation. Our
									innovative solutions are designed to:
								</p>
								<ul className='list-disc pl-5 mb-4 space-y-2 mt-0 text-left'>
									<li className='text-left'>Elevate customer support with intelligent, always-on systems</li>
									<li className='text-left'>Automate complex workflows to boost operational efficiency and minimize manual effort</li>
									<li className='text-left'>Enable smarter, faster decisions through intelligent business logic</li>
								</ul>
								<p>
									Founded by IIT Bombay alumni with over 8 years of hands-on experience in AI, machine learning, and automation, our team
									blends deep technical expertise with practical, real-world insight. This unique combination allows Nimble AI to consistently
									deliver future-ready, impactful innovations that help our clients stay ahead in an ever-evolving digital landscape.
								</p>
							</div>
						</div>
					</div>
				)}
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
					{/* "Write to Us" button updated to mailto link */}
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
						Write to Us
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

// Plan Selection Modal Component
const PlanSelectionModal = ({ isOpen, onClose, selectedPlan, formData, setFormData, onSubmit, isDarkMode, isSubmitting, submitSuccess }) => {
	if (!isOpen) return null;

	// Handler for backdrop click
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget && !isSubmitting) {
			onClose();
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4' onClick={handleBackdropClick}>
			<div
				className={`w-full max-w-md sm:max-w-md rounded-lg shadow-xl ${
					isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
				} mx-2 sm:mx-0`}
			>
				<div className='p-4 sm:p-6'>
					{/* Only show header and cross if not showing success message */}
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-base sm:text-lg font-semibold'>{submitSuccess ? 'Success' : `Select ${selectedPlan?.name} Plan`} </h3>
						<button onClick={onClose} className={`p-1 rounded-full hover:bg-opacity-20 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
							<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
							</svg>
						</button>
					</div>

					{submitSuccess ? (
						<div
							className={`mb-4 p-3 rounded text-center font-medium text-sm sm:text-base ${
								submitSuccess.startsWith('Thank') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
							}`}
						>
							{submitSuccess}
						</div>
					) : (
						<form onSubmit={onSubmit} className='space-y-3 sm:space-y-4'>
							<div>
								<label className='block text-xs sm:text-sm font-medium mb-1'>Name *</label>
								<input
									type='text'
									required
									value={formData.name}
									onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
									className={`w-full px-2 py-2 sm:px-3 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
									}`}
									placeholder='Enter your full name'
								/>
							</div>

							<div>
								<label className='block text-xs sm:text-sm font-medium mb-1'>Work Email *</label>
								<input
									type='email'
									required
									value={formData.email}
									onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
									className={`w-full px-2 py-2 sm:px-3 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
									}`}
									placeholder='Enter your work email'
								/>
							</div>

							<div>
								<label className='block text-xs sm:text-sm font-medium mb-1'>Mobile Number *</label>
								<input
									type='tel'
									required
									value={formData.mobile}
									onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
									className={`w-full px-2 py-2 sm:px-3 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
										isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
									}`}
									placeholder='Enter your mobile number'
								/>
							</div>

							<div>
								<label className='block text-xs sm:text-sm font-medium mb-1'>Selected Plan</label>
								<input
									type='text'
									value={formData.plan}
									readOnly
									className={`w-full px-2 py-2 sm:px-3 sm:py-2 border rounded-md bg-gray-100 text-gray-600 ${
										isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
									}`}
								/>
							</div>

							<div className='flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4'>
								<button
									type='button'
									onClick={onClose}
									className={`w-full sm:w-auto py-2 px-4 border rounded-md font-medium transition-colors ${
										isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
									}`}
								>
									Cancel
								</button>
								<button
									type='submit'
									disabled={isSubmitting}
									className={`w-full sm:w-auto py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${
										isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
									}`}
								>
									{isSubmitting ? (
										<svg
											className='animate-spin h-5 w-5 mr-2 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
										>
											<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
											<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
										</svg>
									) : null}
									{isSubmitting ? 'Submitting...' : 'Submit'}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default App;
