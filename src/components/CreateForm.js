import React, { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import formHeader from '../assets/default-form-header.jpg';
import Type1 from './question_types/Type1';
import Type2 from './question_types/Type2';
import Type3 from './question_types/Type3';
const CreateForm = () => {
    let navigation = useNavigate();
    const [questions, setQuestions] = useState([
        { question: '', questImg: '', type: 'Category', quests: [] },
    ]);
    const [form, setForm] = useState({ title: '', description: '', img: '' });
    const [questionType, setQuestionType] = useState(['Category', 'Cloze', 'Comprehensive']);
    const removeQuestion = (index) => {
        let temp = [...questions];
        temp.splice(index, 1);
        setQuestions(temp);
    }
    const [isSaved, setisSaved] = useState(false);
    const saveForm = async () => {
        try {
            const { title, description, img } = form;
            setisSaved(true);
            const formTitle = title;
            const formDescription = description;
            const formImg = img;
            // console.log(formTitle, formDescription, formImg, questions);
            const res = await fetch('https://form-builder-backend-lzm0.onrender.com/createForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formTitle, formDescription, formImg, questions }),
            });
            const data = await res.json();
            setisSaved(true);
            alert("Form Saved");
            navigation("/view_form")
        }
        catch (error) {
            // console.log(error);
        }
    }
    const [image, setImage] = useState(formHeader);
    const [previewsource, setPreviewSource] = React.useState();
    const handlePhotoInputs = (e) => {
        const file = e.target.files[0];
        previewFile(file);
    };
    const previewFile = (file) => {
        const reader = new FileReader();
        // console.log(file);
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // console.log(reader);
            setPreviewSource(reader.result);
            setForm({ ...form, img: reader.result })
        };
    };
    return (
        <div className='w-full  p-10 gap-5 flex flex-col items-center justify-center'>
            {isSaved ?
                <button onClick={() => { saveForm() }} className="mx-auto w-3/12 flex items-center justify-center gap-5 bg-gray-400 text-white/80 rounded-lg px-3 py-2 my-3" disabled>Saving
                    <div className="border-t-transparent border-solid animate-spin  rounded-full border-white border-2 h-6 w-6"></div>
                </button>
                :
                <>
                    <div className='w-10/12 h-full flex flex-col items-center pb-5 justify-around gap-3 bg-white container rounded-lg'>
                        <img
                            className="w-[100%] h-[200px]"
                            src={
                                previewsource
                                    ? `${previewsource}`
                                    : `${formHeader}`
                            }
                            alt="profilePic"
                        />
                        <div className="container relative w-full mt-16">

                            <input className='hidden' id="uploadBtn" type="file" accept="image/*" onChange={handlePhotoInputs} />
                            <label for='uploadBtn' className='flex items-center justify-center text-base font-medium text-white/80 h-[60px] w-[250px] bg-yellow-600 absolute m-auto top-0 bottom-0 right-0 left-0'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>&nbsp;
                                Upload Form Header</label>
                        </div>
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
                </>
            }
        </div>
    )
}


export default CreateForm