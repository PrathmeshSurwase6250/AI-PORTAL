import axios from "axios";

const askAi = async (messages)=>{
    try{
        if(!messages || !Array.isArray(messages) || messages.length === 0){
            throw new Error("Invalid input: message should be a non-empty array");
        }

        const response  = await axios.post("https://openrouter.ai/api/v1/chat/completions" , {
            model : "openai/gpt-5.2" ,
            messages : messages  
        },{
    headers : {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    }})

    const content = response.data.choices[0].message.content;

    if(!content || !content.trim()){
        throw new Error("Invalid response from AI");
    }
    return content;
    
    }catch(error){
        console.error("Error in askAi function:", error.message);
        throw error;
    }
}