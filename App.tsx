
import React, { useState } from 'react';
import { BriefingData, Step } from './types';
import { 
  SALES_MODELS, 
  PAYMENT_CHANNELS,
  SITE_PAYMENT_METHODS,
  WA_PAYMENT_METHODS,
  DELIVERY_OPTIONS, 
  PRODUCT_VARIATIONS, 
  QUANTITY_OPTIONS, 
  EXPECTATIONS, 
  STYLE_OPTIONS 
} from './constants';

const WEBHOOK_URL = 'https://n8n.srv1130748.hstgr.cloud/webhook/b404cd35-e738-4c83-a7cd-25ab677f70b0';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.INTRO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BriefingData>({
    salesModel: [],
    paymentChannel: '',
    paymentMethods: [],
    delivery: [],
    productType: [],
    productQuantity: '',
    expectations: [],
    otherExpectation: '',
    style: [],
    contact: {
      name: '',
      instagram: '',
      whatsapp: '',
      email: ''
    }
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleReset = () => {
    setFormData({
      salesModel: [],
      paymentChannel: '',
      paymentMethods: [],
      delivery: [],
      productType: [],
      productQuantity: '',
      expectations: [],
      otherExpectation: '',
      style: [],
      contact: {
        name: '',
        instagram: '',
        whatsapp: '',
        email: ''
      }
    });
    setCurrentStep(Step.INTRO);
  };

  const toggleArrayItem = (key: keyof BriefingData, item: string) => {
    setFormData(prev => {
      const currentItems = prev[key] as string[];
      if (Array.isArray(currentItems)) {
        if (currentItems.includes(item)) {
          return { ...prev, [key]: currentItems.filter(i => i !== item) };
        }
        return { ...prev, [key]: [...currentItems, item] };
      }
      return prev;
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [name]: value }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const organizedReport = {
      cliente: {
        nome: formData.contact.name,
        instagram: formData.contact.instagram,
        whatsapp: formData.contact.whatsapp,
        email: formData.contact.email
      },
      questionario: {
        "1. Como quer vender?": formData.salesModel,
        "2. Canal de Pagamento": PAYMENT_CHANNELS.find(c => c.id === formData.paymentChannel)?.label || formData.paymentChannel,
        "3. Métodos de Pagamento": formData.paymentMethods,
        "4. Entrega dos Produtos": formData.delivery,
        "5. Funcionamento dos Produtos": formData.productType,
        "6. Quantidade de Produtos": formData.productQuantity,
        "7. Expectativas do Site": formData.expectations,
        "8. Outro Objetivo": formData.otherExpectation,
        "9. Estilo do Site": formData.style
      },
      metadados: {
        data_envio: new Date().toLocaleString('pt-BR'),
        origem: 'Landing Page Briefing Express'
      }
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizedReport),
      });

      if (!response.ok) {
        console.warn('Erro ao enviar para o webhook.');
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
    } finally {
      setCurrentStep(Step.SUMMARY);
      setIsSubmitting(false);
    }
  };

  const renderProgress = () => {
    if (currentStep === Step.INTRO || currentStep === Step.SUMMARY) return null;
    const progress = ((currentStep - 1) / 8) * 100;
    return (
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
        
        {renderProgress()}

        {currentStep === Step.INTRO && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6">
              Briefing de Loja Online
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">
              Comece sua jornada digital <span className="text-indigo-600">com o pé direito</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Responda a este formulário rápido para que possamos entender seu projeto e preparar a melhor solução para você vender mais.
            </p>
            <button 
              onClick={nextStep}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-200"
            >
              Iniciar Questionário
            </button>
          </div>
        )}

        {currentStep === Step.SALES_MODEL && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Como você quer vender?</h2>
            <p className="text-slate-500 mb-8">Defina o modelo de negócio da sua loja.</p>
            <div className="space-y-3">
              {SALES_MODELS.map(opt => (
                <label key={opt} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.salesModel.includes(opt) ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.salesModel.includes(opt)}
                    onChange={() => toggleArrayItem('salesModel', opt)}
                  />
                  <span className={`w-5 h-5 rounded-md border-2 mr-4 flex items-center justify-center transition-colors ${formData.salesModel.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {formData.salesModel.includes(opt) && <CheckIcon />}
                  </span>
                  <span className="font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.PAYMENT && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Canal de Pagamento</h2>
            <p className="text-slate-500 mb-8">Onde o pagamento será realizado?</p>
            
            <div className="space-y-3 mb-8">
              {PAYMENT_CHANNELS.map(chan => (
                <label key={chan.id} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentChannel === chan.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input 
                    type="radio" 
                    name="paymentChannel"
                    className="hidden" 
                    checked={formData.paymentChannel === chan.id}
                    onChange={() => setFormData(prev => ({ ...prev, paymentChannel: chan.id, paymentMethods: [] }))}
                  />
                  <span className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${formData.paymentChannel === chan.id ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {formData.paymentChannel === chan.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </span>
                  <span className="font-medium text-slate-700">{chan.label}</span>
                </label>
              ))}
            </div>

            {(formData.paymentChannel === 'site' || formData.paymentChannel === 'whatsapp') && (
              <div className="animate-in fade-in duration-500 border-t border-slate-100 pt-8">
                <h3 className="text-lg font-bold mb-4">Escolha os métodos:</h3>
                <div className="space-y-3">
                  {(formData.paymentChannel === 'site' ? SITE_PAYMENT_METHODS : WA_PAYMENT_METHODS).map(opt => (
                    <label key={opt} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethods.includes(opt) ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={formData.paymentMethods.includes(opt)}
                        onChange={() => toggleArrayItem('paymentMethods', opt)}
                      />
                      <span className={`w-5 h-5 rounded-md border-2 mr-4 flex items-center justify-center transition-colors ${formData.paymentMethods.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                        {formData.paymentMethods.includes(opt) && <CheckIcon />}
                      </span>
                      <span className="font-medium text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === Step.DELIVERY && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Entrega dos Produtos</h2>
            <p className="text-slate-500 mb-8">Como os produtos chegarão aos clientes?</p>
            <div className="space-y-3">
              {DELIVERY_OPTIONS.map(opt => (
                <label key={opt} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.delivery.includes(opt) ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.delivery.includes(opt)}
                    onChange={() => toggleArrayItem('delivery', opt)}
                  />
                  <span className={`w-5 h-5 rounded-md border-2 mr-4 flex items-center justify-center transition-colors ${formData.delivery.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {formData.delivery.includes(opt) && <CheckIcon />}
                  </span>
                  <span className="font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.PRODUCTS && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Como funcionam seus produtos?</h2>
            <p className="text-slate-500 mb-8">Informações sobre as variações dos seus produtos.</p>
            <div className="space-y-3">
              {PRODUCT_VARIATIONS.map(opt => (
                <label key={opt} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.productType.includes(opt) ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.productType.includes(opt)}
                    onChange={() => toggleArrayItem('productType', opt)}
                  />
                  <span className={`w-5 h-5 rounded-md border-2 mr-4 flex items-center justify-center transition-colors ${formData.productType.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {formData.productType.includes(opt) && <CheckIcon />}
                  </span>
                  <span className="font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.QUANTITY && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Quantidade de produtos</h2>
            <p className="text-slate-500 mb-8">Estimativa de catálogo inicial.</p>
            <div className="space-y-3">
              {QUANTITY_OPTIONS.map(opt => (
                <label key={opt} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.productQuantity === opt ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input 
                    type="radio" 
                    name="quantity"
                    className="hidden" 
                    checked={formData.productQuantity === opt}
                    onChange={() => setFormData(prev => ({ ...prev, productQuantity: opt }))}
                  />
                  <span className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${formData.productQuantity === opt ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {formData.productQuantity === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                  </span>
                  <span className="font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.EXPECTATIONS && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">O que você espera do site?</h2>
            <p className="text-slate-500 mb-8">Quais são suas principais prioridades?</p>
            <div className="space-y-3 mb-6">
              {EXPECTATIONS.map(opt => (
                <label key={opt} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.expectations.includes(opt) ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.expectations.includes(opt)}
                    onChange={() => toggleArrayItem('expectations', opt)}
                  />
                  <span className={`w-5 h-5 rounded-md border-2 mr-4 flex items-center justify-center transition-colors ${formData.expectations.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {formData.expectations.includes(opt) && <CheckIcon />}
                  </span>
                  <span className="font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">Outro objetivo (opcional):</label>
              <textarea 
                className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 focus:outline-none transition-colors"
                placeholder="Ex: Ter um blog de conteúdo..."
                rows={2}
                value={formData.otherExpectation}
                onChange={(e) => setFormData(prev => ({ ...prev, otherExpectation: e.target.value }))}
              />
            </div>
          </div>
        )}

        {currentStep === Step.STYLE && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Estilo do Site</h2>
            <p className="text-slate-500 mb-8">Escolha a identidade visual para sua loja.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STYLE_OPTIONS.map(opt => (
                <label key={opt} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.style.includes(opt) ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.style.includes(opt)}
                    onChange={() => toggleArrayItem('style', opt)}
                  />
                  <span className={`w-5 h-5 rounded-md border-2 mr-4 flex items-center justify-center transition-colors ${formData.style.includes(opt) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {formData.style.includes(opt) && <CheckIcon />}
                  </span>
                  <span className="font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === Step.CONTACT && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold mb-2">Dados para Contato</h2>
            <p className="text-slate-500 mb-8">Finalize informando seus dados.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Seu nome"
                  value={formData.contact.name}
                  onChange={handleContactChange}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-600 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Instagram (@usuario)</label>
                <input 
                  type="text" 
                  name="instagram"
                  placeholder="@sualoja"
                  value={formData.contact.instagram}
                  onChange={handleContactChange}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-600 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">WhatsApp</label>
                <input 
                  type="text" 
                  name="whatsapp"
                  placeholder="(00) 00000-0000"
                  value={formData.contact.whatsapp}
                  onChange={handleContactChange}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-600 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">E-mail</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="contato@exemplo.com"
                  value={formData.contact.email}
                  onChange={handleContactChange}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === Step.SUMMARY && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-center py-8">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckIcon size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Respostas enviadas com sucesso.</h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-md mx-auto">
              Obrigado pelo seu tempo! Recebemos suas informações e entraremos em contato em breve para conversar sobre seu projeto.
            </p>
            <button 
              onClick={handleReset}
              className="text-indigo-600 font-bold hover:underline py-2"
            >
              Preencher novamente
            </button>
          </div>
        )}

        {currentStep > Step.INTRO && currentStep < Step.SUMMARY && (
          <div className="flex gap-4 mt-10 pt-6 border-t border-slate-100">
            {currentStep > Step.SALES_MODEL && (
              <button 
                onClick={prevStep}
                className="flex-1 border-2 border-slate-200 text-slate-600 font-bold py-3 px-6 rounded-2xl hover:bg-slate-50 transition-all"
                disabled={isSubmitting}
              >
                Voltar
              </button>
            )}
            <button 
              onClick={currentStep === Step.CONTACT ? handleSubmit : nextStep}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting || (currentStep === Step.PAYMENT && !formData.paymentChannel)}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                currentStep === Step.CONTACT ? 'Finalizar e Enviar' : 'Próxima'
              )}
            </button>
          </div>
        )}

      </div>

      <footer className="mt-8 text-slate-400 text-sm flex items-center gap-1">
        Profissionalismo e transparência em seu projeto.
      </footer>
    </div>
  );
};

const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default App;
