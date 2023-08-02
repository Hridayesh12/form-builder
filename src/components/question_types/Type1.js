import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const Type1 = () => {
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

            setItems([...items, { item: currentItem, category: 'Not Selected' }]);
        }
    };
    return (
        <div className="w-full sm:w-11/12 mx-auto flex flex-col justify-around gap-3 bg-white container rounded-lg">
            <input type='text' className='w-10/12 h-12 border-2 border-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-blue-500' placeholder='Description (optional)' />
            <h1 className='text-xl font-normal'>Add Categories : </h1>
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
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={index} className='flex flex-row justify-between items-center w-6/12 h-12 border-2 border-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-blue-500'>
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
            <input value={currentCategory} type='text' className='w-3/12 h-12 border-2 border-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-blue-500' placeholder={`Category ${category.length + 1}`} onChange={(e) => { setCurrentCategory(e.target.value); }} onKeyDown={handleKeyDown} />
            <div className='flex flex-col gap-3'>
                <div className='flex flex-row gap-48'>
                    <h1 className='text-xl font-normal'>Items : </h1>
                    <h1 className='text-xl font-normal'>Belongs To : </h1>
                </div>
                <DragDropContext onDragEnd={(params) => {
                    const srcI = params.source.index;
                    const destI = params.destination.index;
                    const temp = [...items];
                    temp.splice(destI, 0, temp.splice(srcI, 1)[0]);
                    setItems(temp);
                }}>
                    <Droppable droppableId='droppable-2'>
                        {(provided, _) => (
                            <div className='flex flex-col justify-around gap-2 w-6/12' ref={provided.innerRef} {...provided.droppableProps}>

                                {
                                    items?.map((item, index) => (
                                        <Draggable key={index} draggableId={"draggable-" + index} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='flex flex-row gap-8'>
                                                    <input type='text' className='w-3/12 h-12 border-2 border-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-blue-500' value={item.item} onChange={(e) => {
                                                        let temp = [...items];
                                                        temp[index].item = e.target.value;
                                                        setItems(temp);
                                                    }} />
                                                    <select className='w-3/12 h-12 border-2 border-gray-300 rounded-lg text-xl text-gray-700 font-normal focus:outline-none focus:border-blue-500' value={item.category} onChange={(e) => {
                                                        let temp = [...items];
                                                        temp[index].category = e.target.value;
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
                    <input type='text' placeholder='Item' value={currentItem} onChange={(e) => { setCurrentItem(e.target.value) }} onKeyDown={handleKeyDownItems} />
                </div>
            </div>
            <button className='bg-blue-500 text-white rounded-lg px-2 py-1' onClick={() => { console.log(category); }}>Submit</button>
        </div>
    )
}

export default Type1