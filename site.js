const serviceImages={
  'Desentupidora':'/assets/esgoto.jpg',
  'Encanador':'/assets/pia.jpg',
  'Eletricista':null,
  'Caça-vazamentos com geofone':'/assets/tubulacao.jpg',
  'Limpeza de caixa d’água':null,
  'Limpeza de placas solares':null
};
const defaultGallery=[
  {title:'Desentupimento de esgoto',category:'Atendimento especializado',url:'/assets/esgoto.jpg'},
  {title:'Desentupimento de vasos sanitários',category:'Serviço residencial',url:'/assets/vaso.jpg'},
  {title:'Desentupimento de pias',category:'Serviço hidráulico',url:'/assets/pia.jpg'},
  {title:'Limpeza de caixas de gordura',category:'Manutenção',url:'/assets/caixa-gordura.jpg'},
  {title:'Manutenção de tubulações',category:'Serviço hidráulico',url:'/assets/tubulacao.jpg'},
  {title:'Hidrojateamento',category:'Limpeza técnica',url:'/assets/hidrojateamento.jpg'}
];
const defaults={
  company:'AM Manutenção',
  hero:'Soluções completas para sua casa, empresa ou condomínio.',
  about:'Atendimento para necessidades de manutenção em residências, empresas e condomínios.',
  phone:'(63) 99264-8492',
  whatsapp:'(63) 99264-8492',
  email:'',
  address:'',
  cities:'Palmas e região',
  hours:'',
  social:'',
  cnpj:'',
  seoTitle:'AM Manutenção | Desentupidora, hidráulica e elétrica em Palmas',
  seoDescription:'AM Manutenção em Palmas e região. Desentupidora, serviços hidráulicos e elétricos, caça-vazamentos, limpeza de caixa d’água e placas solares.',
  services:[
    {id:'s0',title:'Desentupidora',description:'Desentupimento de pias, ralos, vasos sanitários, tubulações e redes de esgoto.',visible:true,order:0},
    {id:'s1',title:'Encanador',description:'Serviços hidráulicos, reparos, instalações e manutenção de tubulações.',visible:true,order:1},
    {id:'s2',title:'Eletricista',description:'Instalações, verificações e reparos elétricos residenciais e comerciais.',visible:true,order:2},
    {id:'s3',title:'Caça-vazamentos com geofone',description:'Localização de vazamentos com equipamento apropriado, reduzindo quebras desnecessárias.',visible:true,order:3},
    {id:'s4',title:'Limpeza de caixa d’água',description:'Limpeza para contribuir com a conservação e a qualidade da água armazenada.',visible:true,order:4},
    {id:'s5',title:'Limpeza de placas solares',description:'Limpeza dos módulos para auxiliar na manutenção do desempenho do sistema.',visible:true,order:5}
  ],
  gallery:[],
  testimonials:[]
};
const storageKey='am_site_preview_v1';
function loadData(){
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(!saved)return structuredClone(defaults);
    return {...defaults,...saved,services:Array.isArray(saved.services)&&saved.services.length?saved.services:defaults.services};
  }catch{return structuredClone(defaults)}
}
const data=loadData();
const digits=value=>String(value||'').replace(/\D/g,'');
function whatsappUrl(message=''){
  const number=digits(data.whatsapp||defaults.whatsapp);
  if(number.length<10)return null;
  const international=number.startsWith('55')?number:'55'+number;
  return 'https://wa.me/'+international+(message?'?text='+encodeURIComponent(message):'');
}
function safe(value){
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function renderServices(){
  const grid=document.getElementById('service-grid');
  const select=document.getElementById('service-select');
  const services=(data.services||defaults.services).filter(item=>item.visible!==false).sort((a,b)=>(a.order||0)-(b.order||0));
  grid.innerHTML=services.map((item,index)=>'<article class="service-card">'+(serviceImages[item.title]?'<img class="service-image" loading="lazy" src="'+serviceImages[item.title]+'" alt="'+safe(item.title)+'">':'')+'<div class="service-card-content"><div class="service-card-top"><span class="service-number">'+String(index+1).padStart(2,'0')+'</span><span class="service-rule"></span></div><h3>'+safe(item.title)+'</h3><p>'+safe(item.description)+'</p><a href="#contato" class="service-link" data-service="'+safe(item.title)+'">Solicitar este serviço <span aria-hidden="true">↗</span></a></div></article>').join('');
  const gallery=document.getElementById('gallery-grid');
  if(gallery)gallery.innerHTML=defaultGallery.map(item=>'<article class="gallery-photo"><img loading="lazy" src="'+item.url+'" alt="'+safe(item.title)+'"><div><h3>'+safe(item.title)+'</h3><p>'+safe(item.category)+'</p></div></article>').join('');
  select.innerHTML='<option value="">Selecione uma opção</option>'+services.map(item=>'<option value="'+safe(item.title)+'">'+safe(item.title)+'</option>').join('');
  grid.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{
    select.value=link.dataset.service;
  }));
}
function setupContact(){
  const number=digits(data.phone||defaults.phone);
  document.querySelectorAll('.phone-link').forEach(link=>link.href='tel:+'+(number.startsWith('55')?number:'55'+number));
  document.querySelectorAll('.whatsapp-link').forEach(link=>{
    const url=whatsappUrl('Olá! Gostaria de solicitar um orçamento com a AM Manutenção.');
    if(url){link.href=url;link.target='_blank';link.rel='noopener noreferrer';}
  });
  const form=document.getElementById('quote-form');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const values=new FormData(form);
    const message=[
      'Olá! Gostaria de solicitar um orçamento com a AM Manutenção.',
      '',
      'Nome: '+values.get('name'),
      'Telefone: '+values.get('phone'),
      'Cidade/bairro: '+values.get('location'),
      'Serviço: '+values.get('service'),
      'Descrição: '+(values.get('description')||'Não informada')
    ].join('\n');
    const url=whatsappUrl(message);
    const status=document.getElementById('form-status');
    if(!url){status.textContent='Não foi possível abrir o WhatsApp. Ligue para (63) 99264-8492.';return;}
    status.textContent='Abrindo o WhatsApp para você revisar e enviar sua solicitação.';
    window.open(url,'_blank','noopener,noreferrer');
  });
}
function boot(){
  document.getElementById('year').textContent=new Date().getFullYear();
  document.title=data.seoTitle||defaults.seoTitle;
  const description=document.querySelector('meta[name="description"]');
  if(description)description.content=data.seoDescription||defaults.seoDescription;
  renderServices();
  setupContact();
}
document.addEventListener('DOMContentLoaded',boot);