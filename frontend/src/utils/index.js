import {surpriseMePrompts} from '../constants';
import FileSaver from 'file-saver';

export function getRandonPrompt(prompt){
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randonPrompt = surpriseMePrompts[randomIndex];
    if(randonPrompt === prompt) return getRandonPrompt(prompt);

    return randonPrompt;
}

export async function downloadImage(_id, photo){
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}

export function randonNum(){
    const valor = Math.floor(Math.random() * (999999 - 99999))
    console.log(valor)
    return valor
}