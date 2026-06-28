import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";
import ImageKit from "imagekit";


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export async function sendMessage(req, res) {
    const { message, chat: chatId, imageBase64 } = req.body;
    
    let uploadedImageUrl = null;

    if (imageBase64) {
        try {
            const response = await imagekit.upload({
                file: imageBase64, 
                fileName: `chat_image_${Date.now()}.jpg`, 
                folder: "/perplexity_clone"
            });
           
            uploadedImageUrl = response.url; 
        } catch (error) {
            console.error("ImageKit Upload Error:", error);
            return res.status(500).json({ message: "Failed to upload image" });
        }
    }

    let title = null, chat = null;

    if (!chatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

   
    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user",
        imageBase64: uploadedImageUrl 
    });

    const messages = await messageModel.find({ chat: chatId || chat._id })

  
    const result = await generateResponse(messages, imageBase64);

    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: result,
        role: "ai"
    })

    res.status(201).json({
        title,
        chat,
        aiMessage,
        userImageUrl: uploadedImageUrl 
    })
}

export async function getChats(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id })

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}

