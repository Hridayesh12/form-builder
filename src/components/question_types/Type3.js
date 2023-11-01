import React, { useState, useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Type3 = ({ questionId, questions, setQuestions, questionType, setQuestionType }) => {
    const textAreaRef = useRef(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [poll, setPoll] = useState([]);
    const ChangepollDescription = (question, index) => {
        let newpollDescription = [...poll];
        newpollDescription[index].pollDescription = question;
        let temp = [...questions];
        temp[questionId].quests[index].pollDescription = question;
        setPoll(newpollDescription);
    }
    const ChangePollOption = (option, place, index) => {
        let newOption = [...poll];
        newOption[index].pollOption[place].optionValue = option;
        let temp = [...questions];
        temp[questionId].quests[index].pollOption[place].optionValue = option;
        setQuestions(temp);
        setPoll(newOption);
    }
    const addOption = (i, index) => {
        let addOption = [...poll];
        if (addOption[index].pollOption.length < 5) {
            addOption[index].pollOption[i] = { optionValue: "", optionCorrect: false };
            let temp = [...questions];
            temp[questionId].quests[index].pollOption[i] = { optionValue: "", optionCorrect: false };
            setQuestions(temp);
        } else {
        }
        setPoll(addOption);
    }
    const selectCorrectOption = (corOpt, i, index) => {
        let selectedOption = [...poll];
        let temp = [...questions];
        for (let k = 0; k < selectedOption[index].pollOption.length; k++) {
            if (k == i) {
                selectedOption[index].pollOption[i].optionCorrect = true;
                temp[questionId].quests[index].pollOption[i].optionCorrect = true;
            }
            else {
                selectedOption[index].pollOption[k].optionCorrect = false;
                temp[questionId].quests[index].pollOption[k].optionCorrect = false;
            }
        }
        setQuestions(temp);
        setPoll(selectedOption);
    }
    function addPollButton() {
        setPoll([...poll, {
            pollDescription: "",
            pollOption: [
                { optionValue: "", optionCorrect: false },
                { optionValue: "", optionCorrect: false },
            ],
        }]);

        let temp = [...questions];
        temp[questionId].quests.push(
            {
                pollDescription: "",
                pollOption: [
                    { optionValue: "", optionCorrect: false },
                    { optionValue: "", optionCorrect: false },
                ],
            }
        );
        setQuestions(temp);
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
    useEffect(() => {
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }, [pollQuestion])
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
            <textarea className='text-md p-2 border-2 border-gray-300 rounded-lg outline-none focus:outline-none focus:border-blue-700' value={pollQuestion} onChange={(e) => {
                setPollQuestion(e.target.value);
                let temp = [...questions];
                temp[questionId].question = e.target.value;
                setQuestions(temp);
            }} rows='1' ref={textAreaRef} placeholder='Enter Passage'></textarea>
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
            <div className="container relative w-full mt-8 mb-8">
                <input className='hidden' id="uploadBtn3" type="file" accept="image/*" onChange={handlPhotoInputs} />
                <label for='uploadBtn3' className='flex items-center justify-center text-base font-medium text-white/80 h-[60px] w-[250px] bg-purple-600 absolute m-auto top-0 bottom-0 right-0 left-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>&nbsp;
                    Upload Image If Required</label>
            </div>
            {poll?.map((item, index) => (
                <div className='rounded-lg w-10/12 mx-auto border-2 border-gray-300 p-10 flex items-center justify-center flex-col'>
                    <div className='w-full flex items-center justify-between my-2'>
                        <h1 className='text-xl font-normal'>Question {questionId + 1}.{index + 1} : </h1>
                        <button className='px-2 py-1' onClick={() => {
                            let temp = [...poll];
                            temp.splice(index, 1);
                            setPoll(temp);
                            let temp1 = [...questions];
                            temp1[questionId].quests.splice(index, 1);
                            setQuestions(temp1);
                        }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <input className='rounded-lg w-full border-2 border-gray-300 p-2 outline-none focus:outline-none focus:border-blue-700' type="text" placeholder="Question" onChange={(e) => ChangepollDescription(e.target.value, index)} />
                    <DragDropContext onDragEnd={(params) => {
                        const srcI = params.source.index;
                        const destI = params.destination.index;
                        const temp = [...poll];
                        temp[index].pollOption.splice(destI, 0, temp[index].pollOption.splice(srcI, 1)[0]);
                        setPoll(temp);
                        let temp1 = [...questions];
                        temp1[questionId].quests[index].pollOption.splice(destI, 0, temp1[questionId].quests[index].pollOption.splice(srcI, 1)[0]);
                        setQuestions(temp1);
                    }}>
                        <Droppable droppableId='droppable-1'>
                            {(provided, _) => (
                                <div className='flex flex-col justify-around gap-2 w-full' ref={provided.innerRef} {...provided.droppableProps}>
                                    {item?.pollOption?.map((op, i) => (
                                        <Draggable key={i} draggableId={"draggable-" + i} index={i}>
                                            {(provided, snapshot) => (
                                                <div className='flex mt-2 gap-2 items-center' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={i}>
                                                    <input type="radio" id="optionentry" name={item['pollDescription']} value={op['optionValue']} onClick={(e) => { selectCorrectOption(e.target.value, i, index) }} />
                                                    <label className='flex' for="optionentry">
                                                        <input className='rounded-lg w-full border-2 border-gray-300 p-2 outline-none focus:outline-none focus:border-blue-700' value={op.optionValue} type="text" placeholder="Option" onChange={(e) => ChangePollOption(e.target.value, i, index)} />
                                                        <button className='px-2 py-1' onClick={() => {
                                                            if (i !== 0) {
                                                                let temp = [...poll];
                                                                temp[index].pollOption.splice(i, 1);
                                                                setPoll(temp);
                                                                let temp1 = [...questions];
                                                                temp1[questionId].quests[index].pollOption.splice(i, 1);
                                                                setQuestions(temp1);
                                                            }
                                                        }} >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </label>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <>{item?.pollOption?.length < 5 ? (<button className='bg-blue-500  text-md text-white rounded-lg p-2' onClick={() => addOption(item?.pollOption.length, index)}>Add Option</button>) : ""} </>
                </div>
            ))}
            <button onClick={addPollButton} className='bg-blue-300 text-white p-2 rounded-lg mx-auto w-3/12'>Add MCQs</button>
        </div>
    )
}

export default Type3