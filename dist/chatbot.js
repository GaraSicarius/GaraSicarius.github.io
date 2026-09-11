/* Multinomial Naive Bayes: train word likelihoods from labeled examples.
   Responses are authored facts, not model-generated text. No external service. */
(function(root){
const unknown='Insufficient data to verify. That detail has not been provided in this portfolio.';
const stop=new Set('a an the is are am i me my you your he his him carl aguas joseph what which who when where how can could do does did about tell please would like know of and in to for it have has was on at from'.split(' '));
const tokenize=s=>(s.toLowerCase().match(/[a-z0-9]+(?:#|\+\+)?/g)||[]).filter(t=>!stop.has(t)).map(t=>t==='prefer'?'preferred':t);
function makeTopics(data){const p=data.personal;const personal=(v)=>v||unknown;return [
{id:'intro',q:['hello hi hey','introduce yourself','background profile biography','tell me about yourself','who is carl'],a:'Carl Joseph Aguas is a fourth-year BSIT student with hands-on experience developing academic projects involving software, web, databases, cloud, and IoT solutions.'},
{id:'skills',q:['skills technologies programming languages','technical abilities expertise','what languages do you code','programming skills stack','tools use development'],a:'Programming: Java, JavaScript, C#, Python, SQL. Cloud and infrastructure: AWS (EC2, S3, IAM, VPC), TCP/IP, basic network configuration, Cisco Packet Tracer, and hardware/software troubleshooting. Tools: Git, GitHub, Visual Studio, Visual Studio Code. Soft skills: team collaboration, problem-solving, adaptability, and time management.'},
{id:'education',q:['education university college school degree','where studying student course','educational background studies','graduation graduate year','academic honors dean lister'],a:'The résumé lists Philippines Christian University: BSIT, 2022–present, with expected graduation in 2027; STEM, 2020–2022. Academic honors: Dean’s Lister for AY 2024–2025 and AY 2025–2026.'},
{id:'projects',q:['projects built portfolio work','academic projects developed','systems created projects','tell me about projects','project experience'],a:'Carl contributed to two academic team projects: a Hospital Management System using C#, .NET Framework, MySQL, and Visual Studio; and an Inventory Management System using Java and MySQL. Ask about either system for his contributions.'},
{id:'hospital',q:['hospital management system','hospital interface contribution role','hospital project technology','hospital design modules panels','hospital responsibilities'],a:data.projects[0].title+' — '+data.projects[0].technologies.join(', ')+'. '+data.projects[0].contributions.join(' ')},
{id:'inventory',q:['inventory management system','inventory contribution role','inventory project technology','inventory encapsulation oop','inventory responsibilities'],a:data.projects[1].title+' — '+data.projects[1].technologies.join(', ')+'. '+data.projects[1].contributions.join(' ')},
{id:'birthday',q:['birthday date birth born','when birthday','birth date','when were you born','birthday month day'],a:personal(p.birthday)&&p.birthday?'Carl’s birthday is '+p.birthday+'.':unknown},
{id:'hobbies',q:['hobbies interests spare time','free time reading playing','what hobbies','pastimes fun leisure','do for fun'],a:p.hobbies?'Carl’s hobbies are '+p.hobbies.toLowerCase()+'.':unknown},
{id:'goals',q:['goals aspirations ambitions','career goal future plans','what motivates you','aim ambition professional goal','career vision'],a:p.careerGoals?'Carl’s stated goal: '+p.careerGoals+'.':unknown},
{id:'roles',q:['preferred roles positions job','development roles interested','role looking for','job preference developer','preferred position'],a:p.preferredRoles?'Carl is interested in development roles. A specific development specialization has not been provided.':unknown},
{id:'availability',q:['availability available start hiring','when can start work','available internship employment','start date joining','available now'],a:p.availability||'Insufficient data to verify. Carl’s availability is currently unspecified.'},
{id:'github',q:['github repository repositories','github link profile','code github','garasicarius github','github account'],a:p.github?'Carl’s GitHub: '+p.github:unknown},
{id:'linkedin',q:['linkedin profile link','linkedin account','linkedin page','professional linkedin'],a:personal(p.linkedin)},
{id:'contact',q:['contact email phone address','reach email','contact information','location live city','telephone number'],a:'Email: carljoseph.aguas@gmail.com. Address: 11 B Leonardo St. Pasay City. The résumé lists the phone number as 63+9452874381.'},
{id:'seminars',q:['seminars webinars attended','workshops learning events','blockchain summit seminar','responsible ai webinar','building future seminar'],a:'Seminars/webinars listed in the résumé: Building the Future: Real-World Tools for IT and CS Students (May 2025); Blockchain Summit (November 2025); Responsible Use of AI in Education (March 2026).'},
{id:'certificates',q:['certificates certifications credentials','earned certificate','certificate showcase','certified qualifications','awarded certificates'],a:data.certificates.some(c=>c.verified)?data.certificates.filter(c=>c.verified).map(c=>c.title+' — '+c.issuer+', '+c.date).join('\n'):'Insufficient data to verify. Certificate images and details have not been provided yet. The showcase currently contains placeholders.'}
];}
function createAssistant(data){const topics=makeTopics(data),vocab=new Set();const models=topics.map(t=>{const counts={};let total=0;t.q.forEach(q=>tokenize(q).forEach(w=>{counts[w]=(counts[w]||0)+1;total++;vocab.add(w)}));return {...t,counts,total}});
function answer(query){if(!query.trim()||query.length>400)return {text:unknown};const words=tokenize(query);if(!words.length){if(/who.*carl|about yourself/i.test(query))return {text:topics[0].a,source:'Profile'};return {text:unknown};}
// Decline unknown details, comparisons, instructions, and multi-topic questions.
if(/\b(ignore|system prompt|instruction|password|salary|married|favorite|favourite|age|how old|years of experience|employer|reference|girlfriend|boyfriend|religion)\b/i.test(query))return {text:unknown};
const known=words.filter(w=>vocab.has(w));if(!known.length||known.length/words.length<.65)return {text:unknown};
const ranked=models.map(t=>({topic:t,score:known.reduce((s,w)=>s+Math.log(((t.counts[w]||0)+.001)/(t.total+.001*vocab.size)),0)})).sort((a,b)=>b.score-a.score);
const confidence=1/ranked.reduce((s,r)=>s+Math.exp(r.score-ranked[0].score),0);
if(confidence<.9)return {text:'Insufficient data to verify. Please ask one specific question about skills, education, a named project, birthday, hobbies, goals, contact details, or GitHub.'};
return {text:ranked[0].topic.a,source:['birthday','hobbies','goals','roles','availability','github','linkedin'].includes(ranked[0].topic.id)?'Information supplied by Carl':ranked[0].topic.id==='certificates'?'Certificate showcase':'Résumé',intent:ranked[0].topic.id};}
return {answer};}
root.createPortfolioAssistant=createAssistant;
})(typeof window!=='undefined'?window:globalThis);
