// functions/api/v1/day.ts — Public API for widget
// GET /api/v1/day?date=YYYY-MM-DD
const CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const CHI=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const THU=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const TEN_GIO=['Giờ Tý','Giờ Sửu','Giờ Dần','Giờ Mão','Giờ Thìn','Giờ Tỵ','Giờ Ngọ','Giờ Mùi','Giờ Thân','Giờ Dậu','Giờ Tuất','Giờ Hợi'];
const HD=[[1,0,1,0,0,1,0,1,0,0,1,0],[0,1,0,0,1,0,1,0,0,1,0,1],[0,0,1,1,0,0,1,1,0,0,1,1],[1,1,0,0,1,1,0,0,1,1,0,0],[0,1,0,1,0,0,1,0,1,0,0,1],[1,0,0,1,0,1,0,0,1,0,1,0],[1,0,1,0,0,1,0,1,0,0,1,0],[0,1,0,0,1,0,1,0,0,1,0,1],[0,0,1,1,0,0,1,1,0,0,1,1],[1,1,0,0,1,1,0,0,1,1,0,0],[0,1,0,1,0,0,1,0,1,0,0,1],[1,0,0,1,0,1,0,0,1,0,1,0]];
const TU=[1,-1,0,2,-2,1,0,1,-1,-1,-1,-2,0,1,0,1,2,-1,1,-2,0,2,-2,-1,0,1,-1,0];

function jdn(d:number,m:number,y:number):number{let yy=y,mm=m;if(mm<=2){yy--;mm+=12;}const A=Math.floor(yy/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(yy+4716))+Math.floor(30.6001*(mm+1))+d+B-1524;}

const CORS={'Access-Control-Allow-Origin':'*','Cache-Control':'public,max-age=3600'};

export async function onRequestGet({request}:{request:Request}){
  const s=new URL(request.url).searchParams.get('date')||new Date().toLocaleString('sv-SE',{timeZone:'Asia/Ho_Chi_Minh'}).split(' ')[0]!;
  const [y,m,d]=s.split('-').map(Number) as [number,number,number];
  const j=jdn(d,m,y);
  const cc=`${CAN[(j+9)%10]} ${CHI[(j+1)%12]}`;
  const chi=(j+1)%12;
  const hdRow=HD[chi]??HD[0]!;
  const gh=TEN_GIO.filter((_,i)=>hdRow[i]===1);
  const tu=TU[((j-2451549)%28+28)%28]??0;
  const ld=((j-2415021)%30+30)%30+1;
  let sc=3+tu;if([3,7,13,18,22,27].includes(ld))sc-=2;if([5,14,23].includes(ld))sc-=1;
  sc=Math.max(1,Math.min(5,Math.round(sc)));
  return Response.json({day:d,month:m,year:y,weekday:THU[new Date(Date.UTC(y,m-1,d)).getUTCDay()],canChi:cc,score:sc,label:sc>=4?'Ngày Tốt':sc<=2?'Ngày Xấu':'Bình Thường',goodHours:gh,detailUrl:`https://lichvannien.io.vn/lich/${y}/${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}`},{headers:CORS});
}
export async function onRequestOptions(){return new Response(null,{status:204,headers:CORS});}
