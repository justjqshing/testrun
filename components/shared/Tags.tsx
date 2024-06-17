// 'use client'
// import { useState } from 'react'
// import { Input } from '../ui/input'
// import { Button } from '../ui/button'


  
// const Tags = ({ onChangeHandler }: TagsProps) => {
//     const [tags, setTags] = useState<string[]>([])
//     const [inputValue, setInputValue] = useState('') // Step 1: Track the input value

//     const HandleChange = () => {
//         if (inputValue.trim()) { // Check if the input value is not just whitespace
            
//             setTags([...tags, inputValue.trim()]) // Step 3: Use the input value to add a new tag
//             setInputValue('') // Step 4: Reset the input field
//         }
//     }

//     return (
//         <div className='flex flex-col'>
//             <div className='flex flex-row'>
//                 <Input 
//                     type='text' 
//                     placeholder='Tags' 
//                     className='w-full'
//                     value={inputValue} // Display the current input value
//                     onChange={(e) => setInputValue(e.target.value)} // Step 2: Update the input value on change
                    
//                 />
//                 <Button 
//                     variant='outline' 
//                     type='button' 
//                     className='rounded-full' 
//                     size='lg' 
//                     onClick={HandleChange} // Use the current input value when clicked
//                 >
//                     Add
//                 </Button>
//             </div>
//             {tags.map((tag, index) => (
//                 <div key={index}> {/* Use index as key for simplicity */}
//                     <span>{tag}</span>
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default Tags