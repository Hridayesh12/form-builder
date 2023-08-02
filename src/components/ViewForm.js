import React, { useState, useEffect } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useParams, Link } from 'react-router-dom';

const ViewForm = () => {
    let { _id } = useParams();
    const [form, setForm] = useState({});
    useEffect(() => {
        fetch(`https://form-builder-backend-lzm0.onrender.com/getForm/${_id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data); setForm(data['Success'])
            })
    }, [])
    return (
        <div className='w-full h-full flex flex-col'>
            <div className="w-full flex flex-col justify-center p-10">
                <h1 className="text-xl text-gray-900">{form.formTitle}</h1>
                <hr className="w-full border-2 border-gray-900" />
                <h1 className="text-lg text-gray-900">{form.formDescription}</h1>
            </div>
            {form?.questions?.map((question, index) => (
                <div key={index} className="flex w-full gap-2">
                    {question.type === 'Category' ?
                        <Type1 quesionId={index} quesion={question} /> :
                        question.type === 'Cloze' ?
                            <Type2 quesionId={index} quesion={question} /> :
                            question.type === 'Comprehensive' ?
                                <Type3 quesionId={index} quesion={question} /> :
                                ""
                    }
                </div>
            ))}
            <Link to={`/response`} className="mx-auto w-3/12 flex items-center justify-center bg-gray-900 text-white rounded-lg px-3 py-2 my-3">Submit</Link>
        </div>
    )
}

export default ViewForm


const Type1 = ({ quesionId, quesion }) => {
    const [items, setItems] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    let [arr, setArr] = React.useState({});
    useEffect(() => {
        let main = quesion;
        let temp = quesion?.quests;
        let temp1 = [...categories];
        let temp2 = [...items];
        console.log(temp);
        for (let i = 0; i < temp.length; i++) {
            temp1[i] = temp[i].category;
            temp2[i] = temp[i].item;
        }
        temp1 = Array.from(new Set(temp1));
        temp2 = Array.from(new Set(temp2));
        console.log(temp1, temp2);
        setCategories(temp1);
        setItems(temp2);
        main.cats = [];
        for (let i = 0; i < temp1.length; i++) {
            main.cats.push({ id: i, name: temp1[i], things: [] });
        }
        console.log(main);
        setArr(main);
    }, []);
    return (
        <DragDropContext onDragEnd={(params) => {
            console.log(params);
            let arrayId = parseInt(params.source.droppableId.slice(-1));
            let destinationId = parseInt(params.destination.droppableId.slice(-1));
            let srcI = params.source.index;
            let temp = [...arr.cats];
            let temp1 = [...items];
            if (arrayId === 1) {
                for (let i = 0; i < temp.length; i++) {
                    if (i === destinationId) {
                        temp[i].things.push(temp1[srcI]);
                        temp1.splice(srcI, 1);
                    }
                }
                setArr({ ...arr, cats: temp });
                setItems(temp1);
            }
        }}>
            <div className="p-5 my-5 w-full sm:w-10/12 mx-auto flex flex-col justify-around gap-3 bg-white container rounded-lg">
                <h1 className="text-xl underline text-gray-900 my-5">Question {quesionId + 1}</h1>
                <hr className="w-full border-2 border-gray-900" />
                <h1 className="text-xl text-gray-900">{arr.question}</h1>
                <Droppable droppableId='droppable-1'>
                    {(provided, _) => (
                        <div className='flex flex-col justify-around gap-2 w-full' ref={provided.innerRef} {...provided.droppableProps}>
                            <div className='flex gap-5'>
                                {items.map((item, index) => (
                                    <Draggable key={index} draggableId={"draggable-1-" + index} index={index}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index} className='flex justify-center items-center px-6 py-2 bg-blue-200 rounded-lg text-md text-gray-700 font-normal'>
                                                {item}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>

                <div className='flex gap-2'>
                    {arr.cats?.map((ited, id) => (
                        <Droppable droppableId={'droppable-' + id}>
                            {(provided, _) => (
                                <div className='flex flex-col items-center justify-around gap-2 w-64 h-64 bg-red-200 rounded-lg' ref={provided.innerRef} {...provided.droppableProps}>
                                    <h1 className='text-black text-xl my-2'>{ited.name}</h1>
                                    <hr className='w-full border-2 border-black' />
                                    <div className='flex flex-col h-full w-full'>
                                        {ited.things?.map((item, index) => (
                                            <div key={index} className='flex items-center justify-between w-10/12 pl-2 py-2 text-md border-2 border-black rounded-lg text-black mx-auto mt-2'>
                                                {item}
                                                <button>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={() => {
                                                        let temp = [...arr.cats];
                                                        let temp1 = [...items];
                                                        for (let i = 0; i < temp.length; i++) {
                                                            if (i === id) {
                                                                temp[i].things.splice(index, 1);
                                                                temp1.push(item);
                                                            }
                                                        }
                                                        setItems(temp1);
                                                        setArr({ ...arr, cats: temp });
                                                    }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </div>
        </DragDropContext>
    )
}

const Type2 = ({ quesionId, quesion }) => {
    const [fillUps, setFillUps] = useState([]);
    const [arrd, setArrd] = useState({})
    useEffect(() => {
        let temp = quesion.quests;
        let temp1 = [...fillUps];
        for (let i = 0; i < temp.length; i++) {
            temp1[i] = 'k';
        }
        setArrd(quesion);
        setFillUps(temp1);
    }, [])
    return (
        <div className="p-5 my-5 w-full sm:w-10/12 mx-auto flex flex-col justify-around gap-3 bg-white container rounded-lg ">
            <h1 className="text-xl underline text-gray-900 my-5">Question {quesionId + 1}</h1>
            <hr className="w-full border-2 border-gray-900" />
            <DragDropContext onDragEnd={(params) => {
                console.log(params);
                let arrayId = 'k';
                let destinationId = parseInt(params.destination.droppableId.slice(-1));
                let srcI = params.source.index;
                let destI = params.destination.index;
                console.log(arrayId, destinationId, srcI);
                let temp = [...arrd.quests];
                let temp1 = [...fillUps];
                if (arrayId === 'k') {
                    temp1[srcI] = temp[srcI];
                    temp[srcI] = 'k';
                    console.log(temp, temp1);
                    setArrd({ ...arrd, quests: temp });
                    setFillUps(temp1);
                }
            }}>
                <Droppable droppableId='droppable-k'>
                    {(provided, _) => (
                        <div className='flex flex-col justify-around gap-2 w-full h-12' ref={provided.innerRef} {...provided.droppableProps}>
                            <div className='flex gap-5'>
                                {arrd.quests?.map((item, index) => (
                                    <Draggable key={index} draggableId={"draggable-1-" + index} index={index}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index} >
                                                {
                                                    fillUps.includes(item) || item === 'k' ?
                                                        <h1 className='text-black text-md'>{ }</h1>
                                                        : <div className='flex justify-center text-white items-center px-6 py-2 border-2 bg-purple-500 border-gray-300 rounded-lg font-normal'>
                                                            {item}
                                                        </div>
                                                }
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                        </div>
                    )}
                </Droppable>
                <div className='flex text-md items-center'>
                    {
                        arrd?.question?.split(' ').map((item, index) => {
                            if (arrd.quests.includes(item)) {
                                return (
                                    <Droppable droppableId={'droppable-' + arrd.quests.indexOf(item)}>
                                        {(provided, _) => (
                                            <div className='flex flex-col justify-around gap-2 w-32 rounded-lg h-12 bg-red-200' ref={provided.innerRef} {...provided.droppableProps}>

                                            </div>
                                        )}
                                    </Droppable>
                                )
                            }
                            else {
                                return (

                                    <>
                                        {
                                            fillUps.includes(item) ?
                                                <div className='flex justify-center text-white items-center px-6 py-2 text-md border-2 bg-purple-500 border-gray-300 rounded-lg font-normal'>
                                                    {item}
                                                </div>
                                                : <p className='text-md'>&nbsp;{item}&nbsp;</p>
                                        }
                                    </>

                                )
                            }
                        }
                        )
                    }
                </div>
            </DragDropContext>
        </div>
    )
}

const Type3 = ({ quesionId, quesion }) => {
    console.log("Hello", quesion)
    return (
        <div className="p-5 my-5 w-full sm:w-10/12 mx-auto flex flex-col justify-around gap-3 bg-white container rounded-lg ">
            <h1 className="text-xl underline text-gray-900 my-5">Question {quesionId + 1}</h1>
            <hr className="w-full border-2 border-gray-900" />
            <textarea value={quesion.question} className='w-full text-md p-2 border-2 border-gray-300 rounded-lg' disabled></textarea>
            <div className='my-5 bg-blue-300 p-2 rounded-lg mx-auto flex items-center justify-center w-3/12'>MCQs</div>
            {quesion?.quests?.map((item, index) => (
                <div className='rounded-lg w-10/12 mx-auto border-2 border-gray-300 p-10 flex items-center justify-center flex-col'>
                    <div className='w-full flex items-center justify-between my-2'>
                        <h1 className='text-xl font-normal'>Question {quesionId + 1}.{index + 1} : </h1>
                    </div>
                    <input value={item['pollDescription']} className='rounded-lg w-full border-2 border-gray-300 p-2 outline-none focus:outline-none focus:border-blue-700' type="text" placeholder="Question" disabled />
                    <div className='flex flex-col justify-around gap-2 w-full' >
                        {item?.pollOption?.map((op, i) => (
                            <div className='flex mt-2 gap-2 items-center' key={i}>
                                <input type="radio" id="optionentry" name={item['pollDescription']} value={op['optionValue']} />
                                <label className='flex' for="optionentry">
                                    <input className='rounded-lg w-full border-2 border-gray-300 p-2 outline-none focus:outline-none focus:border-blue-700' value={op['optionValue']} disabled />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}