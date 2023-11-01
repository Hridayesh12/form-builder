import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
            <div>
                <input type='text' className=' mb-5 w-10/12 h-12 border-2 border-gray-300 rounded-lg text-md p-2 text-gray-700 font-normal focus:outline-none focus:border-blue-500' placeholder='Description (optional)' value={questions[questionId].question}
                    onChange={(e) => {
                        let temp = [...questions];
                        temp[questionId].question = e.target.value;
                        setQuestions(temp);
                    }}
                />
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
                <div className="container relative w-full mt-16">
                    <input className='hidden' id="uploadBtn1" type="file" accept="image/*" onChange={handlPhotoInputs} />
                    <label for='uploadBtn1' className='flex items-center justify-center text-base font-medium text-white/80 h-[60px] w-[250px] bg-purple-600 absolute m-auto top-0 bottom-0 right-0 left-0'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>&nbsp;
                        Upload Image If Required</label>
                </div>
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
export default Type1