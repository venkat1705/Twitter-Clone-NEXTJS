
import React, { useRef, useState } from 'react';
import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon,XIcon } from '@heroicons/react/outline';
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from 'next-auth/react';

function Input() {
  const { data: session } = useSession();
    const [input,setInput] = useState("");
    const [selectiveFile,setSelectiveFile] = useState(null);
    const [loading,setLoading] = useState(false);
    const [showEmojis,setShowEmojis] = useState(false);
    const filePickerRef = useRef(null);

    const sendPost = async () => {
      if(loading) return ;
      setLoading(true);

      const docRef = await addDoc(collection(db,"posts"),{
          id: session.user.uid,
          username: session.user.name,
          userImg: session.user.image,
          tag: session.user.tag,
          text: input,
          timestamp: serverTimestamp(),
      });

      const imageRef = ref(storage,`posts/${docRef.id}/image`);
      if(selectiveFile){
        await uploadString(imageRef,selectiveFile,"data_url").then(async ()=>{
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db,"posts",docRef.id),{
            image:downloadURL,
          });
        });
      }
      setLoading(false);
      setInput("");
      setSelectiveFile(null);
    }

    const addImageToPost = (e)=>{
      const reader = new FileReader();
      if(e.target.files[0]){
        reader.readAsDataURL(e.target.files[0]);
      }

      reader.onload = (readerEvent)=>{
        setSelectiveFile(readerEvent.target.result);
      };
    };

  return (
    <div className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll no-scrollbar ${loading && "opacity-60 "}`}>
        <img src={session.user.image} alt=""
        className="h-11 w-11 rounded-full cursor-pointer" />
        <div className="w-full divide-y divide-gray-700">
            <div className={`${selectiveFile && "pb-7"} ${input && "space-y-2.5"} `}>
                <textarea value={input} onChange={(e)=>setInput(e.target.value)} rows="2" placeholder = "what's happening" className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px] "></textarea>
                {selectiveFile && (

                
                <div className="relative">
                    <div onClick = {()=>setSelectiveFile(null)} className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer">
                        <XIcon className="text-white h-5"/>
                    </div>
                    <img src={selectiveFile} alt="" className="rounded-2xl max-h-80 object-contain"/>
                </div>
                )}
            </div>
            {!loading && (
              <div className="fex items-center justify-between pt-2.5">
              <div className="flex items-center">
                  <div className="icon" onClick={()=>filePickerRef.current.click()}>
                      <PhotographIcon className="h-[22px] text-[#1d9bf0] cursor-pointer"/>
                      <input type="file" hidden onChange={addImageToPost} ref={filePickerRef}/>
                  </div>
                  <div className="icon rotate-90">
              <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
              <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
            </div>

            <div className="icon">
              <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
            </div>
            <button className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default xl:ml-[350px] sm:ml-[350px]" 
              disabled={!input.trim() && !selectiveFile}
              onClick={sendPost}
            >Tweet</button>
              </div>
          </div>
            )}
        </div>
    </div>
  )
}

export default Input