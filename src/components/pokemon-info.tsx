import type { Pokemon } from "models";
import { useEffect, useState } from "react";

import "./pokemon-info.css";

type Props = {
  pokemon: Pokemon;
};

export function PokemonInfo({ pokemon }: Props) {

  const [pkType, setPkType] = useState([]);
  const [pkWeak, setPkWeak] = useState([]);
  const [pkStr, setPkStr] = useState([]);
  const [pkWeakness, setPkWeakness] = useState([]);
  
  const fetchType = async ( url, callback ) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      //console.log('pokemon-type',data)
      callback(data)

    } catch (error) {
      console.error("Error fetching Pokemon type:", error);
    }
  };

  useEffect(() => {
      let typeTmp = []
      let weakTmp = []
      let strengthTmp  = []
      //console.log('pokemon',pokemon)

      setPkType([]);
      setPkWeak([]);
      setPkStr([]);

      if( pokemon == undefined) {
        return;
      }

      pokemon.types.forEach((elem,idx) => {
        fetchType(elem.type.url, (data) => {
          
          typeTmp.push({
            name: data.name,
            url: data.sprites['generation-viii']['legends-arceus'].name_icon
          })

          //resistencias
          data.damage_relations.half_damage_from.forEach(str => {
            strengthTmp.push(str.name);
          })
          data.damage_relations.no_damage_from.forEach(str => {
            strengthTmp.push(str.name);
          })
          
          const damage = data.damage_relations.double_damage_from;
          damage.forEach( (weak,idy) => {
            //console.log('weak',weak);
            fetchType(weak.url, (dataW) => {
              
              weakTmp.push({
                name: dataW.name,
                url: dataW.sprites['generation-viii']['legends-arceus'].name_icon
              })

              //ultimo ciclo de debilidades
              if( 
                (pokemon.types.length - 1) == idx 
                  && 
                (damage.length - 1) == idy 
              ) {

                setPkWeak(weakTmp);
                
                const pkWeakLs = weakTmp.filter(w => (strengthTmp.indexOf(w.name)==-1) );
                setPkWeakness(pkWeakLs)
              }
  
            })
          });

          //console.log(pokemon.types.length, pkType.length)

          //ultimo ciclo de tipos
          if( (pokemon.types.length - 1) == idx ) {
            setPkType(typeTmp);
          }
          
        } );
      });
      //document.getElementById("cryAudio").play()

  }, [pokemon]);

  return (
    <div className="pokemon-type">
        <div className="type">
          <strong>Tipos</strong>
          <div className="type-content">
              {pkType.map((e)=> <img key={e.name} alt={e.name} src={e.url} /> )}
          </div>
        </div>
        <div className="weakness">
          <strong>Debilidades</strong>
          <div className="weakness-content">
            { pkWeakness.length > 0
              ?
              pkWeakness.map((e,i)=> <img key={e.name+'-'+i} alt={e.name} src={e.url} /> )
              : 'Ninguna'
            }
          </div>
        </div>
        { pokemon?.cries.latest ?
          <div className="cry">
            <strong>Grito</strong>
            <div className="cry-content">
              <audio controls id="cryAudio" >
                <source src={pokemon.cries.latest} type="audio/ogg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        : '' }
        
    </div>
  );
}
