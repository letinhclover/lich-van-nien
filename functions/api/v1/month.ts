// functions/api/v1/month.ts — GET /api/v1/month?year=2026&month=3
const CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const THU=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const TU=[1,-1,0,2,-2,1,0,1,-1,-1,-1,-2,0,1,0,1,2,-1,1,-2,0,2,-2,-1,0,1,-1,0];

function jdn(d:number,m:number,y:number):number{let yy=y,mm=m;if(mm<=2){yy--;mm+=12;}const A=Math.floor(yy/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(yy+4716))+Math.floor(30.6001*(mm+1))+d+B-1524;}
function score(d:number,m:number,y:number):number{const j=jdn(d,m,y);const t=TU[((j-2451549)%28+28)%28]??0;const ld=((j-2415021)%30+30)%30+1;let s=3+t;if([3,7,13,18,22,27].includes(ld))s-=2;if([5,14,23].includes(ld))s-=1;return Math.max(1,Math.min(5,Math.round(s)));}

const CORS={'Access-Control-Allow-Origin':'*','Cache-Control':'public,max-age=3600'};

export async function onRequestGet({request}:{request:Request}){
  const p=new URL(request.url).searchParams;
  const y=parseInt(p.get('year')||'0'),m=parseInt(p.get('month')||'0');
  if(!y||!m||m<1||m>12) return Response.json({error:'year and month required'},{status:400,headers:CORS});
  const daysInMonth=new Date(Date.UTC(y,m,0)).getUTCDate();
  const days=Array.from({length:daysInMonth},(_,i)=>{
    const d=i+1,j=jdn(d,m,y),s=score(d,m,y);
    const ld=((j-2415021)%30+30)%30+1;
    return{
      day:d,month:m,year:y,
      weekday:THU[new Date(Date.UTC(y,m-1,d)).getUTCDay()],
      canChi:`${CAN[(j+9)%10]} ${CHI[(j+1)%12]}`,
      score:s,label:s>=4?'Ngày Tốt':s<=2?'Ngày Xấu':'Bình Thường',
      isTamNuong:[3,7,13,18,22,27].includes(ld),
      isNguyetKy:[5,14,23].includes(ld),
      detailUrl:`https://lichvannien.io.vn/lich/${y}/${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}`,
    };
  });
  return Response.json({year:y,month:m,totalDays:daysInMonth,days},{headers:CORS});
}
export async function onRequestOptions(){return new Response(null,{status:204,headers:CORS});}
