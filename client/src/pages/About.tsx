import React, { useState } from 'react';
import { 
  Shield, 
  Clock, 
  Award, 
  MapPin, 
  Mail, 
  Globe,
  CheckCircle,
  Star,
  Zap,
  HeartHandshake,
  Trophy,
  Target,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { FaFacebook, FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';

const About: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: "خبرة طويلة",
      description: "خبرة عملية تمتد لأكثر من 14 عامًا (منذ 2010) في مجال تكنولوجيا المعلومات والمراقبة الأمنية"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "حلول متكاملة",
      description: "نقدم خدمات شاملة تشمل بيع وصيانة أجهزة الكمبيوتر، تركيب كاميرات المراقبة، الأنظمة الأمنية، الشبكات، والبرمجيات"
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      title: "جودة عالية",
      description: "نتعامل مع أحدث التقنيات وعلامات تجارية عالمية لضمان أعلى معايير الأداء"
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-purple-600" />,
      title: "خدمة عملاء مميزة",
      description: "نحرص على تقديم دعم فني سريع واحترافي لضمان رضا عملائنا"
    },
    {
      icon: <Trophy className="w-6 h-6 text-purple-600" />,
      title: "ثقة العملاء",
      description: "لدينا سجل حافل بالمشاريع الناجحة مع الأفراد والشركات في المنصورة ومحافظة الدقهلية"
    }
  ];

  const stats = [
    { number: "14+", label: "سنة خبرة", icon: <Clock className="w-8 h-8 text-purple-600" /> },
    { number: "2020", label: "سنة التأسيس", icon: <Star className="w-8 h-8 text-purple-600" /> },
    { number: "100+", label: "مشروع ناجح", icon: <Trophy className="w-8 h-8 text-purple-600" /> },
    { number: "24/7", label: "دعم فني", icon: <Zap className="w-8 h-8 text-purple-600" /> }
  ];

  const faqData = [
    {
      question: "ما هي الخدمات التي تقدمها شركة 2M Technology؟",
      answer: "نقدم مجموعة شاملة من الخدمات تشمل: بيع وصيانة أجهزة الكمبيوتر واللابتوب، تركيب وصيانة كاميرات المراقبة، الأنظمة الأمنية المتقدمة، تصميم وتركيب الشبكات، والحلول البرمجية المتخصصة."
    },
    {
      question: "هل تقدمون خدمة الدعم الفني؟",
      answer: "نعم، نقدم خدمة دعم فني متميزة على مدار الساعة طوال أيام الأسبوع. فريقنا المتخصص جاهز لمساعدتكم في حل أي مشكلة تقنية أو الإجابة على استفساراتكم."
    },
    {
      question: "ما هي مناطق تغطية خدماتكم؟",
      answer: "نخدم بشكل أساسي مدينة المنصورة ومحافظة الدقهلية بالكامل. كما يمكننا تقديم خدماتنا في المحافظات المجاورة حسب طبيعة المشروع."
    },
    {
      question: "هل تقدمون ضمان على الخدمات والمنتجات؟",
      answer: "بالطبع، نقدم ضمان شامل على جميع منتجاتنا وخدماتنا. مدة الضمان تختلف حسب نوع المنتج أو الخدمة، ونحرص على توفير قطع الغيار الأصلية."
    },
    {
      question: "كيف يمكنني الحصول على عرض سعر؟",
      answer: "يمكنكم التواصل معنا عبر الهاتف، الواتساب، البريد الإلكتروني، أو زيارة مقرنا. سنقوم بدراسة احتياجاتكم وتقديم عرض سعر مفصل ومجاني."
    },
    {
      question: "هل تقدمون خدمات للشركات والمؤسسات؟",
      answer: "نعم، نتخصص في تقديم الحلول التقنية للشركات والمؤسسات من جميع الأحجام، بما في ذلك أنظمة الأمان المتقدمة، الشبكات المؤسسية، وحلول تقنية المعلومات الشاملة."
    }
  ];

  const handleMapClick = () => {
    if (window.innerWidth > 768) {
      window.open('https://maps.app.goo.gl/4EyBrf9mrDg2WgYTA', '_blank');
    }
  };

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden text-white min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')`
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-indigo-900/90"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Target className="w-5 h-5 text-purple-200" />
              <span className="text-purple-200 font-medium">من نحن</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              2M Technology
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 font-light leading-relaxed">
              شركة رائدة متخصصة في مجال تكنولوجيا الكمبيوتر وكاميرات المراقبة
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="w-5 h-5 text-purple-200" />
                <span className="text-purple-200">المنصورة، الدقهلية</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="w-5 h-5 text-purple-200" />
                <span className="text-purple-200">منذ 2010</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-br from-slate-50/80 to-purple-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Company Description */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                قصة نجاحنا
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-4xl mx-auto">
                شركة <strong className="text-purple-600">2M Technology</strong> هي شركة رائدة متخصصة في مجال تكنولوجيا الكمبيوتر وكاميرات المراقبة، حيث تقدّم حلولًا متكاملة وعالية الجودة للقطاعين التجاري والسكني. تأسست الشركة رسميًا في عام <strong className="text-purple-600">2020</strong> بمدينة <strong className="text-purple-600">المنصورة</strong>، لكنها تمتلك خبرة واسعة في المجال تعود إلى عام <strong className="text-purple-600">2010</strong>، مما يجعلها واحدة من أبرز الشركات الموثوقة في السوق المصري.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vision Section */}
            <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-white text-center mb-16">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">رؤيتنا</h2>
                <p className="text-lg md:text-xl text-purple-100 leading-relaxed">
                  أن نكون الخيار الأول لعملائنا في مجال التكنولوجيا والأمن الإلكتروني من خلال الابتكار والجودة والالتزام بكافة معايير المهنية.
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  الأسئلة الشائعة
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-6"></div>
                <p className="text-lg text-slate-600">
                  إجابات على أهم الأسئلة التي قد تخطر ببالك
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-purple-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="w-full px-6 py-4 text-right bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 flex items-center justify-between"
                    >
                      <span className="text-lg font-semibold text-slate-800">{faq.question}</span>
                      {activeQuestion === index ? (
                        <ChevronUp className="w-5 h-5 text-purple-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-purple-600" />
                      )}
                    </button>
                    {activeQuestion === index && (
                      <div className="px-6 py-4 bg-white border-t border-purple-100">
                        <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  تواصل معنا
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-6"></div>
                <p className="text-lg text-slate-600">
                  للاستفسارات أو طلب الخدمات
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <a 
                  href="mailto:2mtechnology17@gmail.com"
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">البريد الإلكتروني</h3>
                  <p className="text-slate-600 hover:text-purple-600 transition-colors">2mtechnology17@gmail.com</p>
                </a>

                <div className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">العنوان</h3>
                  <p className="text-slate-600">Atef Abd El-Latif, Mansoura Qism 2, El Mansoura, Dakahlia Governorate 7650164 </p>
                  <button 
                    onClick={() => setShowMap(!showMap)}
                    className="mt-2 text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center justify-center mx-auto"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    {showMap ? 'إخفاء الخريطة' : 'عرض الخريطة'}
                  </button>
                </div>

                <div className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">الدعم الفني</h3>
                  <p className="text-slate-600">24/7 متاح</p>
                </div>

                <div className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">الخدمات</h3>
                  <p className="text-slate-600">المنصورة والدقهلية</p>
                </div>
              </div>

              {/* Map Section */}
              {showMap && (
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
                    <div className="rounded-lg overflow-hidden border border-purple-200 shadow-lg">
                      <div 
                        className="w-full h-[300px] cursor-pointer relative"
                        onClick={handleMapClick}
                      >
                        <iframe
                          src="https://maps.app.goo.gl/4EyBrf9mrDg2WgYTA"
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          allowFullScreen={true}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                        ></iframe>
                        <div className="absolute inset-0 bg-transparent md:block hidden" />
                      </div>
                      <div className="p-4 bg-white flex items-center justify-between">
                        <span className="text-slate-600">اضغط للفتح في خرائط جوجل</span>
                        <ExternalLink className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Links */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-800 mb-6">تابعنا على</h3>
                <div className="flex space-x-4 justify-center">
                  <a 
                    href="https://www.facebook.com/share/19NUCkDMUg/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Facebook" 
                    className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full hover:from-blue-200 hover:to-blue-300 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <FaFacebook className="text-2xl text-blue-600" />
                  </a>
                  <a 
                    href="https://wa.me/201063166996?text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="WhatsApp" 
                    className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full hover:from-green-200 hover:to-green-300 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <FaWhatsapp className="text-2xl text-green-600" />
                  </a>
                  <a 
                    href="https://m.me/102218348579766?source=qr_link_share&text=مرحبآ%20👋%0Aانا%20اتي%20من%20موقع%202m%20Technology" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Messenger" 
                    className="p-4 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full hover:from-blue-200 hover:to-purple-300 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <FaFacebookMessenger className="text-2xl text-blue-600" />
                  </a>
                  <a 
                    href="mailto:2mtechnology17@gmail.com" 
                    aria-label="Email" 
                    className="p-4 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full hover:from-purple-200 hover:to-indigo-300 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <Mail className="text-2xl text-purple-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
