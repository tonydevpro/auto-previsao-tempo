import './App.css';
import {useEffect, useState} from 'react';

function App() {

  const [descricao, setDescricao] = useState('');
  const [cidade, setCidade]=useState('');
  const [icone, setIcone]=useState('');
  const [sensacao, setSensacao]=useState('');
  const [pais, setPais]=useState('');
  const [temperatura, setTemperatura]=useState('');
  const [umidade, setUmidade]=useState('');
  const [nome, setNome]=useState('');
  const [sugestoes, setSugestoes]=useState([]);

  async function api(cidadeNome = cidade){
    try{
      let resultado = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidadeNome}&appid=acce69a959d37a313343fdbb3ede3d03&lang=pt_br&units=metric`)
      let dados = await resultado.json();
      console.log(dados)

      setDescricao(dados.weather[0].description);
      setIcone(dados.weather[0].icon);
      setSensacao(dados.main.feels_like);
      setPais(dados.sys.country);
      setTemperatura(dados.main.temp);
      setUmidade(dados.main.humidity);
      setNome(dados.name);
      
    }
    catch(error){
      alert(`erro ao buscar dados da cidade: ${error.message}`);
    }
  }

  async function buscarSugestoes(props) {
    if(!props){
      setSugestoes([]);
      return;
    }
    try {
      const resposta = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${props}&limit=5&appid=acce69a959d37a313343fdbb3ede3d03`
      );
      const dados = await resposta.json();
      setSugestoes(dados);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  }
  function selecionarSugestao(sugestao) {
    setCidade(sugestao.name); // Atualiza a cidade com o nome da sugestão
    setSugestoes([]); // Limpa as sugestões
    api(sugestao.name); // Chama a API para buscar os dados do tempo
  }
  

  useEffect(()=>{
    console.log(descricao);
    console.log(icone);
    console.log(sensacao);
    console.log(pais);
    console.log(temperatura);
    console.log(umidade);
  }, [descricao, icone, sensacao, pais, temperatura, umidade]);

  return (
    <div className="geral">
      <h1>Previsao de Tempo</h1>
      <div className='pesquisa'>
        <input type='text' value={cidade} onChange={(e)=>{setCidade(e.target.value); buscarSugestoes(e.target.value);}} placeholder='Digite a cidade'/>
        <input type='submit' onClick={()=>selecionarSugestao(cidade)}/>
        {sugestoes.length>0 &&(
          <ul className='sugestoes'>
            {sugestoes.map((sugestao,i)=>(
              <li key={i} onClick={()=>selecionarSugestao(sugestao)}>
                {sugestao.name}, {sugestao.country}
              </li>
            ))}
          </ul>

        )}
        
      </div>
      {icone &&(
      <div className='resultado'>
        <div className='inforIcon'>
          <div className='icon'>
            <img src={`https://openweathermap.org/img/wn/${icone}.png`} alt='icone'/>
          </div>
          <div className='celsius'>
            <p>{temperatura}°C</p>
            <p>sensação {sensacao}°C</p>
          </div>
        </div>
        <div className='infor'>
          <div className='endereco'>
            <p>{pais}</p>
            <p>{nome}</p>
          </div>
          <div className='desc'>
            <p>{descricao}</p>
            <p>Umidade: {umidade}%</p>
          </div>
        </div>
        

      </div>)}
    </div>
  );
}

export default App;
