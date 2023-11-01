import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Type2 = ({ questionId, questions, setQuestions, questionType, setQuestionType }) => {
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
        let temp2 = [...questions];
        temp2[questionId].question = temp.join(" ");
        temp2[questionId].quests = temp1;
        setSentence(temp.join(" "));
        setBlanks(temp1);
    }
    const manageBlanks = (id) => {
        let temp = [...blanks];
        if (value.includes("<u>" + temp[id] + "</u>")) {
            // console.log("yes", temp[id]);
            setValue(value.replace("<u>" + temp[id] + "</u>", temp[id]));
        }
        if (id > -1) {
            temp.splice(id, 1);
        }
        let temp1 = [...questions];
        temp1[questionId].quests = temp;
        setQuestions(temp1);
        setBlanks(temp);
    }
    const [prevsource, setPrevSource] = useState('');
    const handlPhotoInputs = (e) => {
        const file = e.target.files[0];
        prevFile(file);
    };
    const prevFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPrevSource(reader.result);
            let temp = [...questions];
            temp[questionId].questImg = reader.result;
            setQuestions(temp);
        };
    };
    const setDefault = () => {
        setPrevSource('');
        let temp = [...questions];
        temp[questionId].questImg = '';
        setQuestions(temp);
    }
    return (
        <div className="w-full mx-auto flex flex-col justify-around gap-3 bg-white container rounded-lg p-10 border-l-8 rounded-lg border-l-purple-700">
            <div className='flex w-full items-center justify-between'>
                <h1 className='text-xl font-normal'>Question {questionId + 1} : </h1>
                <select value={questions[questionId].type} className='w-3/12 p-2 border-2 border-gray-300 rounded-lg text-md text-gray-700 font-normal focus:outline-none focus:border-blue-500'
                    onChange={(e) => {
                        let temp = [...questions];
                        temp[questionId].type = e.target.value;
                        temp[questionId].quests = [];
                        temp[questionId].question = '';
                        temp[questionId].questImg = '';
                        setQuestions(temp);
                    }}
                >
                    {questionType.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>
            </div>
            {prevsource.length > 0 && (
                <div className='flex w-full gap-2'>
                    <img
                        className="w-[60%]"
                        src={prevsource}
                    />
                    <svg onClick={() => { setDefault() }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            )}
            <div className="container relative w-full mt-4 mb-8">
                <input className='hidden' id="uploadBtn2" type="file" accept="image/*" onChange={handlPhotoInputs} />
                <label for='uploadBtn2' className='flex items-center justify-center text-base font-medium text-white/80 h-[60px] w-[250px] bg-purple-600 absolute m-auto top-0 bottom-0 right-0 left-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>&nbsp;
                    Upload Image If Required</label>
            </div>
            <div className='flex min-w-6/12 border-2 border-gray-300 rounded-lg p-2 text-md'>
                {sentence.length == 0 ?
                    <h2 className='text-gray-500'>Preview</h2>
                    :
                    sentence.split(" ").map((item, index) => (
                        <>
                            {blanks.includes(item) ? <u>{item}&nbsp;</u> : <span>{item}&nbsp;</span>}
                        </>
                    ))
                }
            </div>
            <ReactQuill theme="snow" value={value} placeholder="Write text in single line only, Select the text and underline it. Avoid punctuation while selection." onChange={prepareSentence} modules={{
                toolbar: [["underline"]]
            }} />

            <h1 className='text-md font-normal  pt-10 my-5'>Fill Ups : </h1>
            <DragDropContext onDragEnd={(params) => {
                const srcI = params.source.index;
                const destI = params.destination.index;
                const temp = [...blanks];
                temp.splice(destI, 0, temp.splice(srcI, 1)[0]);
                let temp1 = [...questions];
                temp1[questionId].quests = temp;
                setQuestions(temp1);
                setBlanks(temp);
            }}>
                <Droppable droppableId='droppable-1'>
                    {(provided, _) => (
                        <div className='flex flex-col justify-around gap-2 w-6/12' ref={provided.innerRef} {...provided.droppableProps}>
                            {blanks?.map((item, index) => (
                                <Draggable key={index} draggableId={"draggable-" + index} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index} className='flex flex-row justify-between items-center w-6/12 h-12 border-b-2 border-b-gray-300 text-md text-gray-700 font-normal focus:outline-none focus:border-blue-500'>

                                            <input type='checkbox' key={index} id={index} value={item} name={item} onClick={() => { manageBlanks(index) }} className='w-4 h-4 border-2 border-gray-300 rounded-lg text-md text-gray-700 font-normal focus:outline-none focus:border-blue-500' checked />
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

        </div>
    )
};

export default Type2