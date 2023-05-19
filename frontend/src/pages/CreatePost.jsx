/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';

import {preview} from '../assets';
import {getRandonPrompt, downloadImage, randonNum} from '../utils';
import {FormField, Loader} from '../components'
import { download } from '../assets';

const Createpost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idPhoto, setIdPhoto] = useState(null);

  const handleChange = (e) =>{
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSurpriseMe= () =>{
    const randomPrompt = getRandonPrompt(form.prompt)
    setForm({...form, prompt: randomPrompt})
  }
  
  const generateImage = async () =>{
    if(form.prompt){
      try{
        setGeneratingImg(true);

       
        const response = await fetch('http://localhost:8080/api/v1/dalle',{
          method: 'post',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({prompt: form.prompt}),
        })

        const data = await response.json();
        console.log(data)
        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`})

        setIdPhoto(randonNum());
        console.log(idPhoto)
      }catch (error) {
        alert(error)
        console.log("Erro gerar imagem: "+error)
      }finally{
        setGeneratingImg(false);
      }
    }else{
      alert('Por favor digite um comando')
    }
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();

    if(form.prompt && form.photo){
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method: 'post',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...form})
        })

        await response.json();
        navigate('/');
      } catch (err) {
        alert(err);
      } finally{
        setLoading(false);
      }
    } else{
      alert("Por favor, digite um comando e gere uma imagem")
    }
  };

  return (
    <section className='max-w-7x1 mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Crie</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'>Crie imagens imaginativas e impressionantes por meio de DALL-E AI e compatilhe-as com a comunidade</p>
      </div>

      <form onSubmit={handleSubmit} className='mt-16 max-w-3x1'>
        <div className='flex flex-col gap-5'>
          <FormField 
            labelName="Seu Nome"
            type="text"
            name="name"
            placeholder="David Clipel"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField 
            labelName="Comando"
            type="textarea"
            name="prompt"
            placeholder="Um astronauta descansando em um resort tropical no espaço, vaporwave"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-80 p-3 h-80 flex justify-center items-center'>
            {form.photo ?(
              <img 
                src={form.photo}
                alt={form.prompt}
                className='w-full h-full object-contain' />
            ) :(
              <img 
                src={preview}
                alt="preview"
                className='w-9/12 h-9/12 object-contain opacity-70'
              />
            )}

            {generatingImg &&(
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
            <button
              type='button'
              onClick={generateImage}
              className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
            >

                {generatingImg ? 'Gerando...' : 'Gerar'}
            </button>
        </div>

        <div className='mt-7 flex gap-5'>
            <button
              type='button'
              onClick={() => downloadImage(idPhoto, form.photo)}
              className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center flex gap-2 itens-center justify-center'
            >
              Baixar Imagem 
              <img src={download} alt="" className='w-6 h-6 invert'/>
            </button>
        </div>

        <div className='mt-10'>
              <p className='mt-2 text-[#666e75] text-[14px]'>Depois de criar a imagem desejada, você pode compartilhá-la com outras pessoas da comunidade</p>
              <button
                type='submit'
                className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
              >
                {loading ? 'Compatilhando...' : 'Compatilhe com a comunidade'}
              </button>
        </div>

      </form> 
    </section>
  )
}

export default Createpost