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
    
    const teamCache = localStorage.getItem('pokemon_team') ? JSON.parse( localStorage.getItem('pokemon_team') ) : [null,null,null,null,null]
    console.log('teamCache',teamCache)
    //console.log('pokemon',pokemon?.name) 
    const [team, setTeam] = useState(teamCache);

    const joinTeam = (key) => {
        if(pokemon==undefined) {
            return;
        }
        
        let tempTeam = team ;
        tempTeam[ key ] = pokemon.id-1;    
        
        setTeam(tempTeam)
        localStorage.setItem('pokemon_team', JSON.stringify(tempTeam) );
        //console.log('tempTeam',pokemon, JSON.stringify(tempTeam)) 
                
        let pokemonTmp = pokemons;
        pokemonTmp[key]=<button key={"pokemon-"+key} className="team-pk" onClick={() => joinTeam(key)}>
                    <img
                        src={pokemon?.sprites?.front_default}
                        alt={pokemon?.name}
                    />
                </button>
        setPokemon(pokemonTmp);
        
    };

    const teamEmpty = () => {
        const pokemonTmp = []
        for(let i=0; i<6; i++) {
            pokemonTmp.push(<button key={"pokemon-"+i} onClick={() => joinTeam(i)} className="team-empty" title="Disponible"></button>)
        }
        return pokemonTmp;
    };
        
    useEffect(() => {

        let pokemonTmp = teamEmpty();
        setPokemon(pokemonTmp); 

        team.forEach((pk,pkey) => {

            if(pk==null) {
                return;
            }

            const objPk = pokemonList[pk];
            if(!objPk) {
                return;
            }
            
            fetch(objPk.url)
                .then((res) => {
                    return res.json();
                })
                .then((data) => {  
                    
                    pokemonTmp[pkey]=<button key={"pokemon-"+pkey} className="team-pk" onClick={() => joinTeam(pkey)}>
                        <img
                            src={data?.sprites?.front_default}
                            alt={data?.name}
                        />
                    </button>

                    setPokemon(pokemonTmp); 
                    //console.log('pokemonTmp',pokemonTmp); 
                });
        })
        
    }, [pokemonList,pokemon]);
    
                
    return (
        <div className="pokemon-team">
            <strong>Mi equipo Pokemón</strong>
            <div>
                <small>Click en la casilla para asignar el pokemón a tu equipo</small>
            </div>
            <div className="team">
                {pokemons}
            </div>
        </div>
    );
}
