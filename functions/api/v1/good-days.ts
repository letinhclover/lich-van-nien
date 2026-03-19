// functions/api/v1/good-days.ts — GET /api/v1/good-days?year=2026&month=3&min_score=4
const CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const TU=[1,-1,0,2,-2,1,0,1,-1,-1,-1,-2,0,1,0,1,2,-1,1,-2,0,2,-2,-1,0,1,-1,0];

function jdn(d:number,m:number,y:number):number{let yy=y,mm=m;if(mm<=2){yy--;mm+=12;}const A=Math.floor(yy/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(yy+4716))+Math.floor(30.6001*(mm+1))+d+B-1524;}

const CORS={'Access-Control-Allow-Origin':'*','Cache-Control':'public,max-age=3600'};

export async function onRequestGet({request}:{request:Request}){
  const p=new URL(request.url).searchParams;
  const y=parseInt(p.get('year')||'0'),m=parseInt(p.get('month')||'0');
  const minScore=parseInt(p.get('min_score')||'4');
  if(!y||!m||m<1||m>12) return Response.json({error:'year and month required'},{status:400,headers:CORS});

  const days=[];
  const dim=new Date(Date.UTC(y,m,0)).getUTCDate();
  for(let d=1;d<=dim;d++){
    const j=jdn(d,m,y);
    const t=TU[((j-2451549)%28+28)%28]??0;
    const ld=((j-2415021)%30+30)%30+1;
    const isTam=[3,7,13,18,22,27].includes(ld);
    const isNg=[5,14,23].includes(ld);
    let s=3+t;if(isTam)s-=2;if(isNg)s-=1;
    s=Math.max(1,Math.min(5,Math.round(s)));
    if(s>=minScore){
      days.push({
        day:d,month:m,year:y,score:s,
        canChi:`${CAN[(j+9)%10]} ${CHI[(j+1)%12]}`,
        isTamNuong:isTam,isNguyetKy:isNg,
        detailUrl:`https://lichvannien.io.vn/lich/${y}/${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}`,
      });
    }
  }
  return Response.json({year:y,month:m,minScore,count:days.length,days},{headers:CORS});
}
export async function onRequestOptions(){return new Response(null,{status:204,headers:CORS});}
