import { getPromptById } from "@/lib/actions/prompt.actions"

const page = async ({ params: { id }, searchParams }: any) => {
  

  let prompt = await getPromptById(id)


  return (
    <div>
      {[prompt].map((element: any) => {
        return (
          <div key={element._id} className="flex flex-col w-full h-screen justify-center items-center">
            <h1>{element.title}</h1>
            <p>{element.description}</p>
            <p>{element.prompt}</p>
            <p>{element.organizer._id}</p>
            <p>{element.organizer.firstName}</p>
            <p>{element.organizer.lastName}</p>
          </div>
        )
      })}
    </div>
  )
}

export default page