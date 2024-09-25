import type { Pokemon } from "models";
import { usePokemonList } from "hooks";
import { useEffect, useState } from "react";

import "./pokemon-team.css";

type Props = {
    pokemon: Pokemon;
};

export function PokemonTeam({pokemon}: Props) {
    
    const { pokemonList } = usePokemonList();
    
    const [pokemons, setPokemon] = useState([]);
    
    const teamEmpty = [null,null,null,null,null,null]
    const teamCache = localStorage.getItem('pokemon_team') ? JSON.parse( localStorage.getItem('pokemon_team') ) : teamEmpty
    //console.log('teamCache',teamCache)
    //console.log('pokemon',pokemon?.name) 
    const [team, setTeam] = useState(teamCache);
    const [count, setCount] = useState(0);
   
    const joinTeam = (key) => {
        setCount(teamCache)    

        if(pokemon==undefined) {
            return;
        }

        let tempTeam = team ;
        tempTeam[ key ] = pokemon.id-1;   
        
        localStorage.setItem('pokemon_team', JSON.stringify(tempTeam) );
        
               
        let pokemonTmp = pokemons;
        pokemonTmp[key]=pokemon
        
        setTeam(tempTeam)        
        setPokemon(pokemonTmp);

        console.log('pokemon', pokemon.name)
    };

    useEffect(() => {
       
        let pokemonTmp = pokemons;
        team.forEach((pk,pkey) => {
            const objPk = pokemonList[pk];

            if(pk==null || !objPk) {
                pokemonTmp[pkey]=null
                setPokemon(pokemonTmp); 
                return;
            }
            else {
                fetch(objPk.url)
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {  
                        
                        pokemonTmp[pkey]=data
    
                        setPokemon(pokemonTmp); 
                        //console.log('pokemonTmp',pokemonTmp); 
                    });

            }
        })        
    });
    
                
    return (
        <div className="pokemon-team">
            <strong>Mi equipo Pokemón</strong>
            <div>
                <small>Click en la casilla para asignar el pokemón a tu equipo</small>
            </div>
            <div className="team">
                { pokemons && pokemons.map((info,pkey)=> (
                        info
                    ?
                        <button key={"pokemon-"+pkey} className="team-pk" onClick={() => joinTeam(pkey)}>
                            <img
                                src={info?.sprites?.front_default}                                
                                alt={"#"+info?.id +" / "+ info?.name}
                                title={"#"+info?.id +" / "+ info?.name}
                            />
                        </button>
                    :
                        <button key={"pokemon-"+pkey} onClick={() => joinTeam(pkey)} className="team-empty" title="Disponible"></button>

                ) )}
            </div>
        </div>
    );
}
