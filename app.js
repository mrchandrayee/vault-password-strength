(() => {
  const input = document.querySelector("#password");
  const toggle = document.querySelector("#toggle");
  const suggest = document.querySelector("#suggest");
  const meter = [...document.querySelectorAll(".meter span")];
  const strength = document.querySelector("#strength");
  const bitsLabel = document.querySelector("#bits");
  const lockCard = document.querySelector("#lockCard");
  const lockArt = document.querySelector("#lockArt");
  const lockName = document.querySelector("#lockName");
  const crackText = document.querySelector("#crackText");
  const entropyText = document.querySelector("#entropyText");
  const rank = document.querySelector("#rank");
  const wait = document.querySelector("#wait");

  const tiers = [
    {name:"No lock at all",crack:"The door is standing open.",rank:"OPEN",color:"#8c98a9"},
    {name:"A bent paperclip",crack:"Cracked instantly.",rank:"VERY WEAK",color:"#ff625f"},
    {name:"A padlock",crack:"Cracked in a few seconds.",rank:"WEAK",color:"#ff8b45"},
    {name:"A deadbolt",crack:"Cracked in a few days.",rank:"FAIR",color:"#f4c14f"},
    {name:"A reinforced safe",crack:"This would take a very long time.",rank:"STRONG",color:"#66cdb2"},
    {name:"A bank vault",crack:"A brute-force attack would take an astronomical amount of time.",rank:"VERY STRONG",color:"#20d49a"}
  ];

  function estimate(value) {
    if (!value) return {bits:0,level:0};
    let pool=0;
    if (/[a-z]/.test(value)) pool+=26;
    if (/[A-Z]/.test(value)) pool+=26;
    if (/[0-9]/.test(value)) pool+=10;
    if (/[^a-zA-Z0-9]/.test(value)) pool+=33;
    // Character-set entropy is a rough upper-bound estimate, not a crack-time guarantee.
    let bits=value.length*Math.log2(Math.max(pool,1));
    if (/(.)\1{2,}/.test(value)) bits*=.72;
    if (/^(password|qwerty|letmein|admin|welcome)/i.test(value)) bits=Math.min(bits,8);
    let level=bits<15?1:bits<30?2:bits<45?3:bits<60?4:5;
    return {bits:Math.round(bits),level};
  }
  function formatCrack(bits) {
    // Illustrative offline estimate using 10 billion guesses/second.
    const seconds=Math.pow(2,Math.min(bits,1023))/1e10;
    if(bits<15)return "Cracked instantly.";
    if(seconds<60)return `Could be guessed in about ${Math.max(1,Math.round(seconds))} seconds.`;
    if(seconds<3600)return `Could take about ${Math.round(seconds/60)} minutes.`;
    if(seconds<86400)return `Could take about ${Math.round(seconds/3600)} hours.`;
    if(seconds<31557600)return `Could take about ${Math.round(seconds/86400)} days.`;
    if(seconds<3.154e12)return `Could take about ${Math.round(seconds/31557600).toLocaleString()} years.`;
    return "A brute-force attack would take an astronomical amount of time.";
  }
  function render() {
    const value=input.value;
    const result=estimate(value);
    const tier=tiers[result.level];
    meter.forEach((bar,index)=>bar.style.background=index<result.level?tier.color:"#263244");
    strength.textContent=value?(result.level>=5?"Very strong":tier.rank[0]+tier.rank.slice(1).toLowerCase()):"Waiting for a password";
    bitsLabel.textContent=`${result.bits} bits estimated entropy`;
    lockCard.dataset.level=String(result.level);
    lockArt.dataset.level=String(result.level);
    lockName.textContent=value?tier.name:"No lock at all";
    crackText.textContent=value?formatCrack(result.bits):"The door is standing open.";
    entropyText.textContent=`${result.bits} bits of estimated entropy`;
    rank.textContent=value?tier.rank:"—";
    rank.style.color=value?tier.color:"#8492a4";
    wait.textContent=value?(result.level===5?"The vault is holding strong.":"Can you make the next lock?"):"Wait for the last lock!";
    lockCard.style.borderColor=value?tier.color+"88":"#344154";
    const bars=[...document.querySelectorAll(".card-bars i")];
    bars.forEach((bar,i)=>{bar.style.height=i<result.level?`${45+i*12}%`:"15%";bar.style.background=i<result.level?tier.color:"#344354"});
  }
  input.addEventListener("input",render);
  toggle.addEventListener("click",()=>{input.type=input.type==="password"?"text":"password";toggle.textContent=input.type==="password"?"◉":"◎";toggle.setAttribute("aria-label",input.type==="password"?"Show password":"Hide password");input.focus()});
  suggest.addEventListener("click",()=>{const words=["moth","lantern","copper","meadow","orbit","velvet","harbor","comet"];const a=words[Math.floor(Math.random()*words.length)],b=words[Math.floor(Math.random()*words.length)];input.value=`${a}-${b}-${Math.floor(10+Math.random()*90)}!`;input.type="text";toggle.textContent="◎";render();input.focus()});
  render();
})();