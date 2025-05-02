import { useState } from 'react'
import '../styles/SearchBarComponent.css'

export const SeachBarComponent = () => {

    const [search, setSearch] = useState('')

    const handleInputChange = ({ target }) => {
        setSearch(target.value)
        console.log(target.value)
    }

    return (
        <>
            <div className='search-section'>
                <h3>Busca ofertas en hoteles, casas y mucho mas</h3>

                <form>

                    <input
                        type='text'
                        placeholder='¿A donde vamos ? '
                        value={search}
                        onChange={handleInputChange}
                    />

                    <input
                        type='date'
                        placeholder='Check in - Check out '
                       
                    />
                    <button className='button-search'>Buscar</button>

                </form>

            </div>
        </>
    )
}