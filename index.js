function lessonTimes(){
    let sessions = [];
    let x = document.cookie;
    let y = x.split(";");
    if(y.length > 0 && y[0]!=""){
        for(var i = 0; i < y.length; i++){
            let qy = y[i].split("=");
            if(qy[0] == "sessions"){
                sessions = JSON.parse(qy[1]);
            }
        }
    } else {
        sessions = [
            {start:"0905",end:"1005",type:"L",name: "PERIOD_1"},
            {start:"1005",end:"1025",type:"B",name: "BREAK_MORNING"},
            {start:"1025",end:"1125",type:"L",name: "PERIOD_2"},
            {start:"1125",end:"1225",type:"L",name: "PERIOD_3"},
            {start:"1225",end:"1330",type:"B",name: "BREAK_LUNCH"},
            {start:"1330",end:"1430",type:"L",name: "PERIOD_4"},
            {start:"1430",end:"1445",type:"B",name: "BREAK_AFTERNOON"},
            {start:"1445",end:"1545",type:"L",name: "PERIOD_5"}
        ]
    }
    return sessions;
}

function now(){
    const d = new Date();
    return {
        hr: d.getHours(),
        mn: d.getMinutes(),
        sx: d.getSeconds(),
        sm: (d.getSeconds() + (d.getMilliseconds() / 1000))
    }
}

function currentSession(nw){
    let sessions = lessonTimes();
    let tnow = nw; // call from now()
    let now4Dig = `${twoDig(tnow.hr)}${twoDig(tnow.mn)}`
    for(var i = 0; i < sessions.length; i++){
        let qr = sessions[i];
        if(qr.start <= now4Dig && qr.end > now4Dig){
            return qr;
        }
    }
    return {start:"",end:"",type:"X",name:"NOTHING"}
}

function twoDig(cd){
    if(cd >= 0 && cd <= 9){
        return `0${cd}`;
    } else {
        return `${cd}`
    }
}

function calcPercentage(cs,nw){ //cs=currentSession nw=now
    if(cs.type=="X"){
        return {percentageDone:"100.00",secondsLeft:0};
    }
    let startHr = parseInt(`${cs.start[0]}${cs.start[1]}`);
    let startMn = parseInt(`${cs.start[2]}${cs.start[3]}`);
    let endHr = parseInt(`${cs.end[0]}${cs.end[1]}`);
    let endMn = parseInt(`${cs.end[2]}${cs.end[3]}`);
    let st = ((startHr*60)+startMn)*60*1000;
    let nwr = (((nw.hr*60)+nw.mn)*60+nw.sm)*1000;
    let diff = nwr-st;
    let ed = ((endHr*60)+endMn)*60*1000;
    let durat = ed-st;
    let prop = diff/durat;
    let tmp = Math.round(prop*10000) / 100;
    let sl = Math.round((durat-diff)/1000);
    return {percentageDone:tmp.toFixed(2),secondsLeft:sl};
}

function retrieve(){
    let nw = now();
    let cs = currentSession(nw);
    let perc = calcPercentage(cs,nw);
    document.getElementById('progpercent').innerHTML = perc.percentageDone;
    document.getElementById('secleft').innerHTML = perc.secondsLeft;
    document.getElementById('ctime').innerHTML = `${twoDig(nw.hr)}:${twoDig(nw.mn)}:${twoDig(nw.sm)}`;
    document.getElementById('lesson').innerHTML = `${cs.start} ${cs.name}`;
    document.getElementById('terminate').innerHTML = `${cs.end}`;
    let col = "#840606";
    if(cs.type=="X"){
        col = "#848406";
    } else if(cs.type == "B"){
        col = "#068406";
    }
    document.getElementById('pb').style = `background-color: ${col}; width: ${perc.percentageDone}%; color:${col}; height: 50px;`;

    let table = `<table><tr><th>Name</th><th>Start</th><th>In</th><th>End</th><th>Type</th></tr>`;
    let sbj = lessonTimes();
    let now4Dig = `${twoDig(nw.hr)}${twoDig(nw.mn)}`;
    for(var i = 0; i < sbj.length; i++){
        let q = sbj[i];
        if(now4Dig < q.start){
            if(q.type=="B"){q.type=`<a style="color:#068406">BREAK</a>`}else{q.type=`<a style="color:#840606">LESSON</a>`}
            table += `<tr>
                <td>${q.name}</td>
                <td>${q.start}</td>
                <td>${timeTill(nw,q.start)}</td>
                <td>${q.end}</td>
                <td>${q.type}</td>
            </tr>`;
        }
    }
    table += `</table>`

    document.getElementById('next').innerHTML = table;
}
let myInterval = setInterval(retrieve,360);

function timeTill(timeNw,start){
    let startHr = parseInt(`${start[0]}${start[1]}`);
    let startMn = parseInt(`${start[2]}${start[3]}`);
    let startTm = ((startHr*60)+startMn);
    let now = ((timeNw.hr*60)+timeNw.mn);
    let diff = startTm - now;
    let leftMins = diff % 60;
    let leftHrs = (diff-leftMins) / 60;
    return `${twoDig(leftHrs)}${twoDig(leftMins)}`;
}