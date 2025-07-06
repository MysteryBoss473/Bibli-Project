interface TitrePage {
    Titre : string,
    SousTitle : string
}
const EntetePage = ({Titre , SousTitle } : TitrePage) => {

  return (

        <div>

            <h1 className="text-4xl md:text-5xl font-bold text-center">
                <br /> {Titre} <br />
             
            </h1>
            <p className="py-6 text-gray-800 text-center">
                {SousTitle}
              
            </p>

        
          </div>


  );
}


export default EntetePage


