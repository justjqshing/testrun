'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPrompt } from "@/lib/actions/prompt.actions";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import { checkForDuplicatePrompt } from "@/lib/actions/prompt.actions";
import { useEffect, useState } from "react";
import { UpdatePrompt } from "@/lib/actions/prompt.actions";
type PromptFormProps = {
    userId: string
    promptDetails?: any
    type?: string
    promptID?: string
    };

const PromptForm = ({ userId, promptDetails, type, promptID }: PromptFormProps) => {
  const [prompt, setPrompt] = useState(false);
  const router = useRouter();
  const initialVlues = type === "Update" ? {...promptDetails} : {title: "", prompt: "", description: "", tags: []};
  const [tags, setTags] = useState<string[]>([])
  const [formSubmitted, setFormSubmitted] = useState(false);
    const [inputValue, setInputValue] = useState('') // Step 1: Track the input value

    const HandleChange = () => {
        if (inputValue.trim()) { // Check if the input value is not just whitespace
            
            setTags([...tags, inputValue.trim()]) // Step 3: Use the input value to add a new tag
            setInputValue('')
        }
    }
    const RemoveTag = (index: number) => {
      if (index !== -1) {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
      }
    }
    const formSchema = type === 'Update' ? z.object({
      title: z.string().min(2).max(50),
      prompt: z.string().refine(async (data) => await checkForDuplicatePrompt({ data, type, promptID }), {
        message: "We are Sure you made an AMAZING Prompt, but it already exists! Display another piece of creativity!",
      }),
      description: z.string().min(2, "Description is too short"),
      tags: z.array(z.string())).refine(() => tags.length > 0, {
        message: "Must Have at least 1 tag"
      })
    }) : z.object({
      title: z.string().min(2).max(50),
      prompt: z.string().refine(async (data) => await checkForDuplicatePrompt({ data }), {
        message: "We are Sure you made an AMAZING Prompt, but it already exists! Display another piece of creativity!",
      }),
      description: z.string().min(2, "Description is too short"),
      tags: z.array(z.string()).refine(() => tags.length > 0, {
        message: "Must Have at least 1 tag"
      })
    });

    useEffect(() => {
      if (formSubmitted) {
        form.trigger("tags")  
      }

    }, [tags, formSubmitted])
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: initialVlues
    });
  
    useEffect(() => {
      setTags(initialVlues.tags);
    }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
      values.tags = tags


    if (type === "Update") {
      const updatedPrompt = await UpdatePrompt({ promptID: promptID, values: { ...values }});
      setTimeout(() => {
        router.push(`/prompt/${updatedPrompt._id}`);
      }, 1000);
      
      return;
    } else {
    const newPrompt = await createPrompt({ userId: userId, values: { ...values } });
    form.reset();
    router.push(newPrompt._id);
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center relative mt-16">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Title</FormLabel>
                <FormControl>
                  <Input
                    className="max-w-[200px] max-sm:w-[200px] "
                    placeholder="Gpt4 Advanced Math"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Prompt Value</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="bg-slate-300 bg-opacity-20 rounded-md backdrop-blur-2xl p-3 min-h-[200px]  min-w-[350px] lg:min-w-[45vw]"
                    placeholder="What is your prompt?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Prompt Desciption </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="bg-slate-300 bg-opacity-20 rounded-md backdrop-blur-2xl p-3 min-h-[200px] lg:min-w-[45vw] min-w-[350px]"
                    placeholder="What does your Prompt do? "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Prompt Tags (Max 5)</FormLabel>
                <FormControl>
                <div className='flex flex-col relative'>
                    <div className='flex flex-row gap-8'>
                        <Input 
                            type='text' 
                            placeholder='Tags' 
                            className='w-full'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            
                        />
                        <Button 
                            variant='outline' 
                            type='button' 
                            className='' 
                            size='lg' 
                            onClick={HandleChange} // Use the current input value when clicked
                            disabled={tags.length >= 5}
                        >
                      
                            Add
                        </Button>
                    </div>
                    <div className="max-w-[800px] flex-wrap flex flex-row gap-5 ">

                    {tags.map((tag, index) => (
                        <div key={index} onClick={() => RemoveTag(index)} className="bg-blue-600 px-4 rounded-lg py-2 bg-opacity-80 "> {/* Use index as key for simplicity */}
                            <span>{tag}</span>
                        </div>
                    ))}
                </div>
                                      
                </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-end ">
            <Button type="submit" onClick={() => setFormSubmitted(true)}>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PromptForm;
