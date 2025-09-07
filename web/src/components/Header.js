import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import companyLogo from '../Assets/companylogo.jpg';
import productImage from '../Assets/Assests2/43.png';
import bookImage from '../Assets/Assests2/44.png';

const DownArrow = () => (
  <svg className="ml-1 h-5 w-5 text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const MenuIcon = () => (
  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MegaMenu = ({ menuData }) => {
  const [activeTab, setActiveTab] = useState(menuData.sections[0].id);

  const activeContent = menuData.content[activeTab];

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 mt-2 z-20 transition-opacity duration-300 opacity-100">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-screen max-w-6xl overflow-hidden">
        <div className="grid grid-cols-12">
          <div className="col-span-3 p-6 border-r border-gray-800">
            {menuData.sections.map(section => (
              <div
                key={section.id}
                onMouseEnter={() => setActiveTab(section.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${activeTab === section.id ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'hover:bg-gray-800'}`}
              >
                <h3 className={`font-semibold tracking-wide text-lg ${activeTab === section.id ? 'text-white' : 'text-gray-200'}`}>
                  {section.title}
                </h3>
                {section.description && <p className="text-base text-gray-400 font-light">{section.description}</p>}
              </div>
            ))}
          </div>
          <div className="col-span-9 p-8">
            <h3 className="text-base font-semibold text-gray-400 tracking-widest uppercase mb-6">{activeContent.title}</h3>
            {activeContent.columns ? (
              <div className={`grid ${activeContent.columns.length === 4 ? 'grid-cols-4' : 'grid-cols-3'} gap-x-6`}>
                {activeContent.columns.map((col, colIndex) => (
                  <div key={colIndex} className={`flex flex-col space-y-2 ${colIndex > 0 ? 'border-l border-gray-800 pl-6' : ''}`}>
                    {col.map(item => (
                      <Link 
                        key={item.to} 
                        to={item.to} 
                        className="text-gray-300 hover:text-white hover:bg-gray-700 font-semibold rounded-lg p-3 transition-all duration-200 transform hover:scale-105"
                      >
                        {item.text}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {activeContent.items.map(item => (
                   <Link 
                     key={item.to} 
                     to={item.to} 
                     className="text-gray-300 hover:bg-gray-800 rounded-lg p-4 transition-all duration-300 group transform hover:scale-105"
                   >
                    <h4 className="font-bold text-white group-hover:text-blue-400 mb-1 text-lg">{item.title}</h4>
                    {item.description && <p className="text-base text-gray-400">{item.description}</p>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TechnologiesMegaMenu = ({ menuData }) => {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 mt-2 z-20">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-screen max-w-7xl overflow-hidden">
        <div className="p-10">
          <div className="grid grid-cols-6 gap-x-8">
            {menuData.columns.map((column, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-white tracking-wide border-b border-gray-700 pb-3 mb-5">
                  <span className="border-b-2 border-blue-500 pb-3">{column.title}</span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {column.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.to}
                      className="text-gray-300 hover:text-blue-400 font-medium text-lg transition-all duration-200 transform hover:translate-x-2"
                    >
                      {item.text}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsMegaMenu = ({ menuData }) => {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
      <div className="w-screen bg-gray-900 border-y border-gray-700 shadow-2xl">
        <div className="max-w-screen-xl mx-auto p-10">
          <div className="grid grid-cols-4 gap-x-12 items-center">
            {/* Left Column: Text Content */}
            <div className="col-span-2 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white tracking-wide mb-4">{menuData.title}</h3>
              <p className="text-gray-300 text-lg mb-6">{menuData.description}</p>
              <Link to={menuData.cta.to}>
                <button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105">
                  {menuData.cta.text}
                </button>
              </Link>
            </div>

            {/* Middle Column: Product List */}
            <div className="col-span-1">
              <div className="flex flex-col space-y-4">
                {menuData.products.map((product, index) => (
                  <Link
                    key={index}
                    to={product.to}
                    className={`text-lg font-semibold transition-all duration-200 transform hover:translate-x-2 ${product.highlight ? 'text-blue-400 hover:text-blue-300' : 'text-gray-300 hover:text-white'}`}
                  >
                    {product.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="col-span-1 text-center">
              <img src={menuData.image.src} alt={menuData.image.alt} className="max-w-full h-auto rounded-lg mb-4" />
              <p className="text-gray-400 text-base">{menuData.image.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourcesMegaMenu = ({ menuData }) => {
  return (
    <div className="absolute top-20 right-8 z-20">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-6xl overflow-hidden">
        <div className="p-10">
          <div className="grid grid-cols-3 gap-x-12 items-start">
            {/* Left Column: Text Content */}
            <div className="col-span-1">
              <h3 className="text-2xl font-bold text-white mb-4">{menuData.title}</h3>
              <p className="text-gray-300 text-lg">{menuData.description}</p>
            </div>

            {/* Middle Column: Links */}
            <div className="col-span-1 flex flex-col items-start space-y-4 border-l border-r border-gray-800 px-12 h-full">
              {menuData.links.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="text-gray-300 hover:text-white font-semibold text-xl transition-all duration-200 transform hover:translate-x-2"
                >
                  - {link.text}
                </Link>
              ))}
            </div>

            {/* Right Column: Featured eBook */}
            <div className="col-span-1">
              <div className="bg-blue-600 rounded-lg p-6 flex items-center space-x-6">
                <img src={menuData.featured.image} alt="eBook cover" className="w-36 h-auto flex-shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-xl">{menuData.featured.title}</h4>
                  <p className="text-blue-200 text-base mb-4">{menuData.featured.subtitle}</p>
                  <Link to={menuData.featured.cta.to} className="inline-flex items-center justify-center px-6 py-2 border border-white text-base font-bold rounded-lg text-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors duration-300">
                    {menuData.featured.cta.text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const DesktopNavLink = ({ to, text, hasArrow, subItems = [], megaMenu, technologiesMenu, productsMenu, resourcesMenu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timer = useRef(null);
  
  const handleMouseEnter = () => {
    clearTimeout(timer.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timer.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <div 
      className={`group ${megaMenu || technologiesMenu || productsMenu || resourcesMenu ? 'static' : 'relative'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={to} className="group-hover:text-white text-gray-300 px-3 py-2 font-medium flex items-center relative text-lg">
        <span>{text}</span>
        {hasArrow && <DownArrow />}
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
      </Link>
      {hasArrow && (
        <div className={`transition-opacity duration-300 ${isDropdownOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {megaMenu && <MegaMenu menuData={megaMenu} />}
          {technologiesMenu && <TechnologiesMegaMenu menuData={technologiesMenu} />}
          {productsMenu && <ProductsMegaMenu menuData={productsMenu} />}
          {resourcesMenu && <ResourcesMegaMenu menuData={resourcesMenu} />}
          {subItems.length > 0 && !megaMenu && !technologiesMenu && !productsMenu && !resourcesMenu && (
             <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-black bg-opacity-80 backdrop-blur-md ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {subItems.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MobileSubMenu = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!item.subSubItems) {
      return (
          <Link to={item.to} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
              - {item.text}
          </Link>
      );
  }
  
  return (
      <div>
          <div 
              onClick={() => setIsOpen(!isOpen)} 
              className="group text-gray-300 px-3 py-2 font-medium flex items-center relative hover:bg-gray-700 hover:text-white block rounded-md text-base justify-between cursor-pointer"
          >
              <span>- {item.text}</span>
              <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                <DownArrow />
              </div>
          </div>
          {isOpen && (
              <div className="pl-6 border-l border-gray-700 ml-3 mt-1">
                  {item.subSubItems.map(subItem => (
                      <Link key={subItem.to} to={subItem.to} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">
                          {subItem.text}
                      </Link>
                  ))}
              </div>
          )}
      </div>
  );
}

const MobileNavLink = ({ to, text, hasArrow, subItems = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    if (hasArrow) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div>
      <Link 
        to={to} 
        onClick={toggleDropdown}
        className="group text-gray-300 px-3 py-2 font-medium flex items-center relative hover:bg-gray-700 hover:text-white block rounded-md text-base justify-between"
      >
        <span>{text}</span>
        {hasArrow && <DownArrow />}
      </Link>
      {hasArrow && isDropdownOpen && (
         <div className="pl-4 mt-1 space-y-1">
           {subItems.map((item, index) => (
             <MobileSubMenu key={index} item={item} />
           ))}
         </div>
       )}
    </div>
  );
};


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = isScrolled 
    ? "fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg border-b border-gray-700 shadow-lg transition-all duration-300"
    : "relative bg-transparent transition-all duration-300";

    const expertiseMegaMenu = {
      sections: [
        { id: 'software-solutions', title: 'Software Solutions >', description: 'Top-tier software solutions to modernize, optimize, and scale your digital operations.' },
        { id: 'ai', title: 'Artificial Intelligence >', description: 'Intelligent AI solutions to automate, personalize, and future-proof your business.' },
        { id: 'industries', title: 'Industries >', description: 'Transforming businesses across industries with scalable and customized tech-driven strategies.' },
      ],
      content: {
        'software-solutions': {
          title: 'OUR OFFERINGS',
          columns: [
            [
              { text: "Software Development", to: "/services/software-development" }, { text: "Mobile App Development", to: "/services/mobile-app-development" },
              { text: "Application Modernization", to: "/services/application-modernization" }, { text: "Hire Dedicated Developers", to: "/services/hire-dedicated-developers" },
              { text: "UI/UX Services", to: "/services/ui-ux-services" }, { text: "SaaS Development", to: "/services/saas-development" },
            ],
            [
              { text: "Web App Development", to: "/services/web-app-development" }, { text: "API Integration", to: "/services/api-integration" },
              { text: "Software Product", to: "/services/software-product" }, { text: "Staff Augmentation", to: "/services/staff-augmentation" },
            ],
            [
              { text: "Data Analytics", to: "/services/data-analytics" }, { text: "Cloud Consulting", to: "/services/cloud-consulting" },
              { text: "DevOps Services", to: "/services/devops-services" }, { text: "Low-Code/No-Code", to: "/services/low-code-no-code" },
            ],
            [
              { text: "Enterprise Software", to: "/services/enterprise-software" }, { text: "Software Outsourcing", to: "/services/software-outsourcing" },
              { text: "CRM Development", to: "/services/crm-development" }, { text: "ERP Software", to: "/services/erp-software" },
            ]
          ]
        },
        'ai': {
            title: 'AI THAT WORKS FOR YOU',
            columns: [
              [
                { text: "GenAI Development", to: "/services/genai-development" }, { text: "GenAI Consulting", to: "/services/genai-consulting" },
                { text: "AI Development", to: "/services/ai-development" }, { text: "AI Agent Development", to: "/services/ai-agent-development" },
                { text: "AI Automation Services", to: "/services/ai-automation-services" }, { text: "AI Software Development", to: "/services/ai-software-development" },
              ],
              [
                { text: "AI Data Annotation", to: "/services/ai-data-annotation" }, { text: "AI Consulting Services", to: "/services/ai-consulting-services" },
                { text: "AI Chatbot Development", to: "/services/ai-chatbot-development" }, { text: "Predictive Analytics Development", to: "/services/predictive-analytics-development" },
              ],
              [
                { text: "LLMs Development", to: "/services/llms-development" }, { text: "LLM Fine-Tuning", to: "/services/llm-fine-tuning" },
                { text: "Computer Vision Development", to: "/services/computer-vision-development" }, { text: "NLP Development Services", to: "/services/nlp-development-services" },
              ],
              [
                { text: "GenAI Integration", to: "/services/genai-integration" }, { text: "ChatGPT Integration", to: "/services/chatgpt-integration" },
                { text: "Mistral AI Integration", to: "/services/mistral-ai-integration" }, { text: "Llama Integration", to: "/services/llama-integration" },
              ],
            ]
        },
        'industries': {
            title: 'INDUSTRIES WE SERVE',
            items: [
              { title: "Fintech", description: "Revolutionize financial services with secure, scalable, and client-centric fintech solutions.", to: "/industries/fintech" },
              { title: "PropTech", description: "Upgrade property management and sales with innovative, hassle-free digital solutions.", to: "/industries/proptech" },
              { title: "Telecom", description: "Elevate customer experiences through customized solutions for next-gen connectivity.", to: "/industries/telecom" },
              { title: "Insurtech", description: "Boost customer trust and engagement with intuitive, modern insurance solutions.", to: "/industries/insurtech" },
              { title: "Retail", description: "Reimagine shopping experiences with smarter, customer-first retail solutions.", to: "/industries/retail" },
              { title: "Automotive", description: "Drive innovation with tailored solutions for smarter, connected vehicles.", to: "/industries/automotive" },
              { title: "Facility Management", description: "Enhance efficiency and control with user-friendly facility management software.", to: "/industries/facility-management" },
              { title: "Healthcare", description: "Revolutionize patient care with seamless, results-oriented, effective healthcare solutions.", to: "/industries/healthcare" },
              { title: "Travel & Hospitality", description: "Delight guests with personalized, tech-enabled travel and hospitality services.", to: "/industries/travel-hospitality" },
              { title: "Transport", description: "Simplify logistics and improve mobility with state-of-the-art transport solutions.", to: "/industries/transport" },
              { title: "EdTech", description: "Empower learners with interactive, scalable, and accessible digital education platforms.", to: "/industries/edtech" },
              { title: "Media & Entertainment", description: "Engage audiences with innovative, dynamic, and engaging content platforms.", to: "/industries/media-entertainment" },
            ]
        }
      }
    };

    const offshoreDeveloperMegaMenu = {
      sections: [
        { id: 'backend', title: 'Hire Backend Developer' },
        { id: 'frontend', title: 'Hire Frontend Developer' },
        { id: 'app', title: 'Hire App Developer' },
        { id: 'ai-engineers', title: 'Hire AI Engineers' },
        { id: 'devops', title: 'Hire DevOps Engineer' },
        { id: 'platform', title: 'Platform' },
      ],
      content: {
        backend: {
          title: "HIRE BACKEND DEVELOPER",
          items: [
            { title: "Node.JS Developer", description: "Optimize backend systems with experienced Node.js developers for your projects.", to: "/hire/nodejs" },
            { title: "Python Developer", description: "Develop scalable solutions with Python developers for diverse industry needs.", to: "/hire/python" },
            { title: "PHP Developer", description: "Build secure, dynamic websites with expert PHP developers for your projects.", to: "/hire/php" },
            { title: "Golang Developer", description: "Empower backend systems with pro-skilled Golang developers for a scalable solution.", to: "/hire/golang" },
            { title: "Java Developer", description: "Build platform-independent, robust apps with skilled Java developers.", to: "/hire/java" },
            { title: "SQL Developer", description: "Optimize data systems with SQL developers highly skilled in database management.", to: "/hire/sql" },
            { title: ".Net Developer", description: "Develop scalable enterprise apps with experienced advanced .NET developers.", to: "/hire/dotnet" },
            { title: "Django Developer", description: "Build secure, modular web solutions with top-rated Django developers.", to: "/hire/django" },
            { title: "Express.js Developer", description: "Simplify backend systems with expert Express.js developers for fast results.", to: "/hire/expressjs" },
            { title: "Spring Boot Developer", description: "Develop production-ready apps with skilled Spring Boot developers.", to: "/hire/springboot" },
          ]
        },
        frontend: {
          title: "HIRE FRONTEND DEVELOPER",
          items: [
            { title: "ReactJS Developer", description: "Create dynamic, user-friendly web apps with certified ReactJS developers.", to: "/hire/reactjs" },
            { title: "Angular Developer", description: "Develop high-performance web apps with Angular developers specializing in UI/UX.", to: "/hire/angular" },
            { title: "Vue Js Developer", description: "Deliver fast, responsive user interfaces with skilled Vue.js developers.", to: "/hire/vuejs" },
            { title: "JavaScript Developer", description: "Enhance project interactivity with skilled JavaScript developers.", to: "/hire/javascript" },
            { title: "TypeScript Developer", description: "Ensure scalable, maintainable apps with expert TypeScript developers.", to: "/hire/typescript" },
            { title: "NextJS Developer", description: "Boost SEO and performance with expert Next.js developers for web solutions.", to: "/hire/nextjs" },
          ]
        },
        app: {
          title: "HIRE APP DEVELOPER",
          items: [
            { title: "React Native Developer", description: "Develop scalable, cross-platform apps with skilled React Native developers.", to: "/hire/react-native" },
            { title: "Flutter Developer", description: "Build high-performance cross-platform apps with expert Flutter developers.", to: "/hire/flutter" },
            { title: "Java Developer", description: "Build platform-independent, robust apps with skilled Java developers.", to: "/hire/java-app" },
            { title: "Hire Full Stack Developer", description: "Our full-stack developers offer solutions to keep your website up-to-date and dynamic.", to: "/hire/fullstack" },
          ]
        },
        'ai-engineers': {
          title: "HIRE AI ENGINEERS",
          items: [
            { title: "Hire AI Development Teams", description: "Top AI developers for solutions tailored to your project goals.", to: "/hire/ai-teams" },
            { title: "Hire Generative AI Engineers", description: "GenAI experts to build creative, AI-driven solutions.", to: "/hire/gen-ai" },
            { title: "AI Team Augmentation Services", description: "Scale faster with trusted AI professionals, on demand.", to: "/hire/ai-augmentation" },
            { title: "Hire Computer Vision Engineers", description: "Specialists in AI-powered visual understanding and analysis.", to: "/hire/cv-engineers" },
            { title: "Hire NLP Engineers", description: "Get NLP specialists to build smarter language-based systems.", to: "/hire/nlp-engineers" },
            { title: "Hire LLM Engineers", description: "Experts in Large Language Models for smarter AI systems.", to: "/hire/llm-engineers" },
          ]
        },
        devops: {
          title: "HIRE DEVOPS ENGINEER",
          items: [
            { title: "AWS Developer", description: "Enhance cloud solutions with skilled AWS developers for scalable infrastructures.", to: "/hire/aws-dev" },
            { title: "Azure Developer", description: "Create enterprise-grade cloud solutions with expert Azure developers.", to: "/hire/azure-dev" },
            { title: "Google Cloud Developer", description: "Achieve modern cloud solutions with highly skilled Google Cloud developers.", to: "/hire/gcp-dev" },
          ]
        },
        platform: {
          title: "PLATFORM",
          items: [
            { title: "Salesforce Developer", description: "Boost CRM efficiency with expert Salesforce developers for tailored solutions.", to: "/hire/salesforce" },
            { title: "MS Power Apps Developer", description: "Streamline workflows with PowerApps developers for tailored business apps.", to: "/hire/powerapps" },
            { title: "Metaverse Developers", description: "Build immersive virtual environments with skilled Metaverse developers.", to: "/hire/metaverse" },
          ]
        }
      }
    };

    const productsMegaMenu = {
      title: "Innovative Products Lineup",
      description: "Discover a diverse suite of advanced products crafted to revolutionize how businesses operate. Each product is engineered with precision, blending cutting-edge technology and user-centric design to optimize performance and drive tangible growth.",
      cta: { text: "Let's Talk", to: "/contact" },
      products: [
        { text: "AI Chatbot", to: "/products/ai-chatbot" },
        { text: "KonarkPro", to: "/products/konarkpro", highlight: true },
        { text: "AI Doc Intelligence", to: "/products/ai-doc-intelligence" },
        { text: "JFT ATS", to: "/products/jft-ats" },
        { text: "JFT Assessmart", to: "/products/jft-assessmart" },
      ],
      image: {
        src: productImage,
        alt: "Innovative Products Illustration",
        caption: "From automating complex workflows to enhancing efficiency and scalability, our products are designed to empower organizations with seamless, intuitive solutions."
      }
    };

    const resourcesMegaMenu = {
      title: "Resource Library",
      description: "Access in-depth guides, blogs, ebooks, real world case studies created by our subject matter experts, designed to empower you and your team with the right resources and stay ahead.",
      links: [
        { text: "Case Studies", to: "/resources/case-studies" },
        { text: "Blogs", to: "/resources/blogs" },
        { text: "Teams", to: "/resources/profile" },
        { text: "Portfolio", to: "/resources/portfolio" },
        { text: "Press Release", to: "/resources/press-release" },
        { text: "eBooks", to: "/resources/ebooks" },
      ],
      featured: {
        image: bookImage,
        title: "Modernize Legacy System With AI: A Strategy for CEOs",
        subtitle: "E-BOOK",
        cta: { text: "Download Now", to: "/download/ebook-modernize-legacy" },
      },
    };

    const technologiesMegaMenu = {
      columns: [
        { title: "Backend", items: [
            { text: "NodeJS", to: "/tech/nodejs" }, { text: "Python", to: "/tech/python" },
            { text: "PHP", to: "/tech/php" }, { text: "Golang", to: "/tech/golang" },
            { text: ".Net", to: "/tech/dotnet" }, { text: "Java", to: "/tech/java" },
            { text: "SQL", to: "/tech/sql" },
          ],
        },
        { title: "Frontend", items: [
            { text: "ReactJS", to: "/tech/reactjs" }, { text: "Angular", to: "/tech/angular" },
            { text: "Vue Js", to: "/tech/vuejs" }, { text: "JavaScript", to: "/tech/javascript" },
            { text: "TypeScript", to: "/tech/typescript" }, { text: "NextJS", to: "/tech/nextjs" },
          ],
        },
        { title: "Framework", items: [
            { text: "Django", to: "/tech/django" }, { text: "Express", to: "/tech/express" },
            { text: "Spring boot", to: "/tech/springboot" },
          ],
        },
        { title: "Mobile", items: [
            { text: "Flutter", to: "/tech/flutter" }, { text: "Java", to: "/tech/java-mobile" },
            { text: "React Native", to: "/tech/react-native" },
          ],
        },
        { title: "DevOps", items: [
            { text: "AWS", to: "/tech/aws" }, { text: "Google Cloud", to: "/tech/gcp" },
            { text: "Azure", to: "/tech/azure" },
          ],
        },
        { title: "More", items: [
            { text: "Salesforce", to: "/tech/salesforce" }, { text: "Microsoft PowerApps", to: "/tech/powerapps" },
            { text: "Metaverse", to: "/tech/metaverse" },
          ],
        },
      ],
    };

  const navLinks = [
    { to: "/", text: "Home", hasArrow: false },
    { 
      to: "/expertise", 
      text: "Our Expertise", 
      hasArrow: true,
      megaMenu: expertiseMegaMenu
    },
    { 
      to: "/technologies", 
      text: "Technologies", 
      hasArrow: true,
      technologiesMenu: technologiesMegaMenu,
    },
    { 
      to: "/offshore-developer", 
      text: "Offshore Developer", 
      hasArrow: true,
      megaMenu: offshoreDeveloperMegaMenu
    },
    { 
      to: "/products", 
      text: "Products", 
      hasArrow: true,
      productsMenu: productsMegaMenu
    },
    { to: "/about", text: "About", hasArrow: false },
    { 
      to: "/resources", 
      text: "Resources", 
      hasArrow: true,
      resourcesMenu: resourcesMegaMenu
    },
  ];

  return (
    <nav className={navClass}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-10 rounded-full" src={companyLogo} alt="Company Logo" />
            </Link>
          </div>

          {/* Nav links in the center */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-6">
              {navLinks.map(link => (
                <DesktopNavLink key={link.to} {...link} />
              ))}
            </div>
          </div>

          {/* Contact button on the right */}
          <div className="hidden md:block">
            <Link to="/contact" className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-md text-base font-medium transition-all duration-300 transform hover:scale-105">
              Contact Us
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black bg-opacity-80 backdrop-blur-md max-h-[calc(100vh-5rem)] overflow-y-auto" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => {
              const mobileProps = {...link};
              if (link.megaMenu) {
                mobileProps.subItems = link.megaMenu.sections.map(section => {
                  const content = link.megaMenu.content[section.id];
                  let subSubItems = [];
                  if (content.columns) {
                    subSubItems = content.columns.flat().map(item => ({ text: item.text, to: item.to }));
                  } else if (content.items) {
                    subSubItems = content.items.map(item => ({ text: item.title, to: item.to }));
                  }
                  return {
                    text: section.title.replace(' >', ''),
                    to: `#${section.id}`,
                    subSubItems: subSubItems
                  };
                });
                delete mobileProps.megaMenu;
              }
              if (link.technologiesMenu) {
                mobileProps.subItems = link.technologiesMenu.columns.map(c => ({
                    text: c.title,
                    to: `#${c.title.toLowerCase().replace(' ', '-')}`,
                    subSubItems: c.items,
                }));
                delete mobileProps.technologiesMenu;
              }
              if (link.productsMenu) {
                mobileProps.subItems = link.productsMenu.products.map(p => ({
                    text: p.text,
                    to: p.to
                }));
                delete mobileProps.productsMenu;
              }
              if (link.resourcesMenu) {
                mobileProps.subItems = link.resourcesMenu.links.map(l => ({
                    text: l.text,
                    to: l.to
                }));
                delete mobileProps.resourcesMenu;
              }
              return <MobileNavLink key={link.to} {...mobileProps} />;
            })}
            <Link to="/contact" className="border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white block w-full text-center px-3 py-2 rounded-md text-base font-medium mt-2">
              Contact Us
            </Link>
          </div>
        </div>
      )}

      {/* Decorative separator for non-scrolled state */}
      {!isScrolled && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 [background-size:200%_auto] animate-disco" />
      )}
    </nav>
  );
};

export default Header; 