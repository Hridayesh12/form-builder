import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Type2 = () => {
    const [sentence, setSentence] = useState('');
    const [value, setValue] = useState('');
    const [blanks, setBlanks] = useState([]);
    const prepareSentence = (value) => {
        setValue(value);
        let temp = value.split(" ");
        let temp1 = [];
        temp[0] = temp[0].replace("<p>", "");
        temp[0] = temp[0].replace("</p>", "");
        temp[temp.length - 1] = temp[temp.length - 1].replace("</p>", "");
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].includes("<u>")) {
                temp1.push(temp[i].replace("<u>", "").replace("</u>", "").replace(".", "").replace(",", "").replace("?", "").replace("!", "").replace("<p>", "").replace("</p>", ""));
                temp[i] = temp[i].replace("<u>", "").replace("</u>", "");
            }
        }
        if (temp[0] === "<br>") {
            temp[0] = "";
        }
        console.log(temp);
        setSentence(temp.join(" "));
        setBlanks(temp1);
    }
    const manageBlanks = (id) => {
        let temp = [...blanks];
        if (value.includes("<u>" + temp[id] + "</u>")) {
            console.log("yes", temp[id]);
            setValue(value.replace("<u>" + temp[id] + "</u>", temp[id]));
        }
        if (id > -1) {
            temp.splice(id, 1);
        }
        setBlanks(temp);

    }
    return (
        <div className="my-5 w-full sm:w-11/12 mx-auto flex flex-col justify-around gap-3 bg-white container rounded-lg">
            <div className='flex'>
                {sentence.split(" ").map((item, index) => (
                    <>
                        {blanks.includes(item) ? <u>{item}&nbsp;</u> : <span>{item}&nbsp;</span>}
                    </>
                ))}
            </div>
            <ReactQuill theme="snow" value={value} onChange={prepareSentence} modules={{
                toolbar: [["underline"]]
            }} />
            <DragDropContext onDragEnd={(params) => {
                const srcI = params.source.index;
                const destI = params.destination.index;
                const temp = [...blanks];
                temp.splice(destI, 0, temp.splice(srcI, 1)[0]);
                setBlanks(temp);
            }}>
                <Droppable droppableId='droppable-1'>
                    {(provided, _) => (
                        <div className='flex flex-col justify-around gap-2 w-6/12' ref={provided.innerRef} {...provided.droppableProps}>
                            {blanks?.map((item, index) => (
                                <Draggable key={index} draggableId={"draggable-" + index} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index} className='flex flex-row justify-between items-center w-6/12 h-12 border-2 border-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-blue-500'>

                                            <input type='checkbox' key={index} id={index} value={item} name={item} onClick={() => { manageBlanks(index) }} className='w-3 h-3 border-2 border-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-blue-500' checked />
                                            <label htmlFor={index} className='text-md font-normal'>{item}</label>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <button onClick={() => { console.log(value, blanks, sentence) }}>Submit</button>
        </div>
    )
}

export default Type2