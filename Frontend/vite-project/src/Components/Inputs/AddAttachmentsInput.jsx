import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from 'react-icons/lu';
const AddAttachmentsInput = ({attachments,setAttachments}) => {
    const [option, setOption] = useState("");
    const handleAddOption = () => {
        if (option.trim()) {
          setAttachments([...attachments, option.trim()]);
          setOption("");
        }
      };
      const handleDeleteOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatedArr);
      };
  return <div>
  {attachments.map((item, index) => (
    <div key={item} className="flex justify-between  bg-gray-50 border border-gray-100 rounded-md px-3 py-2 mb-3">
      <div className="flex-1  flex items-center gap-3 border border-gray-100">
        <LuPaperclip className="text-gray-500 " />
        <p className="text-xs text-black">{item}</p>
      </div>
      <button
        className="cursor-pointer"
        onClick={() => handleDeleteOption(index)}
      >
        <HiOutlineTrash className="text-lg text-red-500" />
      </button>
    </div>
  ))}

  <div className="flex items-center gap-5 mt-4">
    <div className="flex items-center gap-2 flex-1 border border-gray-100 px-3  rounded-md ">
      <LuPaperclip className="text-gray-400" />
      <input
        type="text"
        placeholder="Add File Link"
        value={option}
        onChange={({ target }) => setOption(target.value)}
        className="w-full text-[13px] text-black bg-white outline-none py-2"
      />
    </div>
    <button
      className="card-btn text-nowrap"
      onClick={handleAddOption}
    >
      <HiMiniPlus className="text-lg" /> Add
    </button>
  </div>
</div>

}

export default AddAttachmentsInput