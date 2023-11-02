import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    let Links = [
        {name:"Protokolle",link:"/"},
        {name:"Neu",link:"/new"},
        {name:"Admin",link:"/login"},
    ];
  return (

    <Html lang="en">
      <Head />
      <body>
        {
            <div className="shadwo-md w-full fixed top-0 left-0">
               <div className="md:flex bg_wihte items-center justify-between bg-white py-4 md:px-10 px-7" >
                   <div className="font-bold text-2x1 cursor-pointer flex items-center font-[Poppins] text-gray-800">
                       <img src="/fsmniLogo.png" alt="Logo" className="w-25 h-12 mr-2"/>
                   </div>
               <ul className="md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-withe md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in">

                   {
                       Links.map((link)=>(
                       <li key = {link.name} className="md:ml-8 text-xl md:my-0 my-7">
                           <a href={link.link} className="text-gray-800 hover:text-gray-400 duration-500">{link.name}</a>
                       </li>
                       ))
                   }
                   <div className="col-span-1 rounded-full bg-mni w-10 h-10 flex items-center justify-center text-white md:pb-0 pb-12">
                       <a href="/login" >FS</a>
                   </div>
               </ul>
               </div>
           </div>
        }
        <Main />
        <NextScript />
        {/* <h1>FOOTER</h1> */}
      </body>
    </Html>
  )
}