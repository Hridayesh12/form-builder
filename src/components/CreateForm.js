import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
const CreateForm = () => {
    let navigation = useNavigate();
    const [questions, setQuestions] = useState([
        { question: '', type: 'Category', quests: [] },
    ]);
    const [form, setForm] = useState({ title: '', description: '' });
    const [questionType, setQuestionType] = useState(['Category', 'Cloze', 'Comprehensive']);
    const removeQuestion = (index) => {
        let temp = [...questions];
        temp.splice(index, 1);
        setQuestions(temp);
    }
    const saveForm = async () => {
        try {
            const { title, description } = form;
            const formTitle = title;
            const formDescription = description;
            const res = await fetch('https://form-builder-backend-lzm0.onrender.com/createForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formTitle, formDescription, questions }),
            });
            const data = await res.json();
            alert("Form Saved");
            navigation("/view_form")
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='w-full  p-10 gap-5 flex flex-col items-center justify-center'>
            <div className='w-10/12 h-full flex flex-col items-center py-5 justify-around gap-3 bg-white container rounded-lg'>
                <input type='text' className='w-10/12 h-12 border-b-2 border-b-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-b-blue-500' placeholder='Form Title' value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }) }} />
                <textarea className='w-10/12 h-32 border-2 p-2 border-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-blue-500' placeholder='Form Description' value={form.description} onChange={(e) => { setForm({ ...form, description: e.target.value }) }} />
            </div>
            {questions.map((question, index) => (
                <div key={index} className="flex w-10/12 gap-2">
                    {question.type === 'Category' ?
                        <Type1 questionId={index} questions={questions} setQuestions={setQuestions} questionType={questionType} setQuestionType={setQuestionType} /> :
                        question.type === 'Cloze' ?
                            <Type2 questionId={index} questions={questions} setQuestions={setQuestions} questionType={questionType} setQuestionType={setQuestionType} /> :
                            question.type === 'Comprehensive' ?
                                <Type3 questionId={index} questions={questions} setQuestions={setQuestions} questionType={questionType} setQuestionType={setQuestionType} /> :
                                ""
                    }
                    <div className='flex flex-col items-center gap-3'>
                        <button onClick={() => setQuestions([...questions, { question: '', type: 'Category', quests: [] }])}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <button onClick={() => { removeQuestion(index) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
            <button onClick={() => { saveForm() }} className="mx-auto w-3/12 flex items-center justify-center bg-gray-900 text-white rounded-lg px-3 py-2 my-3">Save</button>
        </div>
    )
}


const Type1 = ({ questionId, questions, setQuestions, questionType, setQuestionType }) => {
    const [category, setCategory] = useState([]);
    const [items, setItems] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');
    const [currentItem, setCurrentItem] = useState('');
    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            if (!category.includes(currentCategory)) {
                setCategory([...category, currentCategory]);
            }
            setCurrentCategory('');
        }
    };
    const handleKeyDownItems = event => {
        if (event.key === 'Enter') {
            if (items.length > 0) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].item === currentItem) {
                        break;
                    };
                }
            }
            let temp = [...questions];
            temp[questionId].quests = [...items, { item: currentItem, category: 'Not Selected' }];
            setQuestions(temp);
            setItems([...items, { item: currentItem, category: 'Not Selected' }]);
            setCurrentItem('');
        }
    };
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
                        setQuestions(temp);
                    }}
                >
                    {questionType.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>
            </div>
            <div>
                <input type='text' className='w-10/12 h-12 border-2 border-gray-300 rounded-lg text-md p-2 text-gray-700 font-normal focus:outline-none focus:border-blue-500' placeholder='Description (optional)' value={questions[questionId].question}
                    onChange={(e) => {
                        let temp = [...questions];
                        temp[questionId].question = e.target.value;
                        setQuestions(temp);
                    }}
                />

            </div>
            <h1 className='text-md font-normal'>Add Categories : </h1>
            <DragDropContext onDragEnd={(params) => {
                const srcI = params.source.index;
                const destI = params.destination.index;
                const temp = [...category];
                temp.splice(destI, 0, temp.splice(srcI, 1)[0]);
                setCategory(temp);
            }}>
                <Droppable droppableId='droppable-1'>
                    {(provided, _) => (
                        <div className='flex flex-col justify-around gap-2 w-6/12' ref={provided.innerRef} {...provided.droppableProps}>
                            {category?.map((item, index) => (
                                <Draggable key={index} draggableId={"draggable-" + index} index={index}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index} className='flex flex-row justify-between items-center w-6/12 p-2 border-2 border-gray-300 rounded-lg text-md text-gray-700 font-normal focus:outline-none focus:border-blue-500'>
                                            <input className='w-full outline-none' type='text' value={item} onChange={(e) => {
                                                let temp = [...category];
                                                temp[index] = e.target.value;
                                                setCategory(temp);
                                            }} />
                                            <button className='px-2 py-1' onClick={() => {
                                                setCategory(category.filter((item1) => {
                                                    return item1 !== item;
                                                }))
                                            }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <input value={currentCategory} type='text' className='w-3/12 p-2 border-2 border-gray-300 rounded-lg text-md text-gray-700 font-normal focus:outline-none focus:border-blue-500' placeholder={`Enter Category ${category.length + 1}`} onChange={(e) => { setCurrentCategory(e.target.value); }} onKeyDown={handleKeyDown} />
            <div className='flex flex-col gap-3 text-md mt-10'>
                <div className='flex flex-row gap-48'>
                    <h1 className='font-normal'>Items : </h1>
                    <h1 className='font-normal'>Belongs To : </h1>
                </div>
                <DragDropContext onDragEnd={(params) => {
                    const srcI = params.source.index;
                    const destI = params.destination.index;
                    const temp = [...items];
                    temp.splice(destI, 0, temp.splice(srcI, 1)[0]);
                    let temp1 = [...questions];
                    temp1[questionId].quests = temp;
                    setQuestions(temp1);
                    setItems(temp);
                }}>
                    <Droppable droppableId='droppable-2'>
                        {(provided, _) => (
                            <div className='flex flex-col justify-around gap-2 w-6/12' ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    items?.map((item, index) => (
                                        <Draggable key={index} draggableId={"draggable-" + index} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='flex flex-row gap-2'>
                                                    <div className='flex flex-row justify-between items-center w-6/12 p-2 border-2 border-gray-300 rounded-lg text-gray-700 font-normal focus:outline-none focus:border-blue-500'>
                                                        <input type='text' className='w-full outline-none' value={item.item} onChange={(e) => {
                                                            let temp = [...items];
                                                            temp[index].item = e.target.value;
                                                            let temp1 = [...questions];
                                                            temp1[questionId].quests = temp;
                                                            setQuestions(temp1);
                                                            setItems(temp);
                                                        }} />
                                                        <button className='px-2 py-1' onClick={() => {
                                                            let temp = [...items];
                                                            let t = temp.filter((item1) => {
                                                                return item1 !== item;
                                                            })
                                                            let temp1 = [...questions];
                                                            temp1[questionId].quests = t;
                                                            setQuestions(temp1);
                                                            setItems(t);
                                                        }}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <select className='w-4/12 p-2 border-2 border-gray-300 rounded-lg text-gray-700 font-normal focus:outline-none focus:border-blue-500' value={item.category} onChange={(e) => {
                                                        let temp = [...items];
                                                        temp[index].category = e.target.value;
                                                        let temp1 = [...questions];
                                                        temp1[questionId].quests = temp;
                                                        setQuestions(temp1);
                                                        setItems(temp);
                                                    }}>
                                                        <option value='Not Selected'>Not Selected</option>
                                                        {category?.map((item1, index1) => (
                                                            <option key={index1} value={item1}>{item1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className='flex flex-row'>
                    <input value={currentItem} onChange={(e) => { setCurrentItem(e.target.value) }} onKeyDown={handleKeyDownItems} type='text' className='w-3/12 p-2 border-2 border-gray-300 rounded-lg text-md text-gray-700 font-normal focus:outline-none focus:border-blue-500' placeholder={`Enter Items `} />

                </div>
            </div>
        </div>
    )
};

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
            console.log("yes", temp[id]);
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
                        setQuestions(temp);
                    }}
                >
                    {questionType.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>
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
export default CreateForm