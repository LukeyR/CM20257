import React, {useRef, useState} from 'react';
import firebase, {auth} from './firebase';
import {useCollection} from 'react-firebase-hooks/firestore';
import './ChatRoom.css';
import {Box, Paper, Typography} from "@material-ui/core";

const firestore = firebase.firestore();
var myID, target, targetID, senderIDDB, receiverIDDB, targetName;
var oldText = "";

function ChatRoom(props) {
    console.log(props)
    myID = props.location.state.myUID;
    target = props.location.state.targetUserName;
    targetID = props.location.state.targetUserID;
    var [me, loading] = useCollection(firestore.collection('users').where("ID", "==", myID));
    var chatNo;

    if (!loading) {
        me.forEach(me => {
            chatNo = me.data().chatsNo;
            if (chatNo == 0) {
                chatNo += 1; // we create our first chat
            }
            senderIDDB = me.id;
        })
    }

    // need to get an instance of the user, for this I need the ID though, not their name
    var [receiver, loadingRe] = useCollection(firestore.collection('users').where("ID", "==", targetID));

    if (!loadingRe) {
        receiver.forEach(receiver => {
            receiverIDDB = receiver.id;
            targetName = receiver.data().Name;
        })
    }

    return (
        <div>
            <h1>Hello again.</h1>
            <h1>We found the following: {target}</h1>
            <h1>Time to finally create the chat with {target} and get into chatting! Yay.</h1>
            <section>
                <Chatroom/>
            </section>
        </div>
    )

}

function Chatroom() {
    const dummy = useRef();
    const messagesRef1 = firestore.collection('users/' + senderIDDB + "/chats"); // me
    const messagesRef2 = firestore.collection('users/' + receiverIDDB + "/chats"); // the other person

    var [messages1, loading] = useCollection(messagesRef1.where("SenderID", "==", targetID)); // I receive message
    var [messages2, loading2] = useCollection(messagesRef1.where("ReceiverID", "==", targetID)); // I send message

    var messages = [];
    var count = 0;
    if (!loading && !loading2) {
        messages1.forEach(msg => {
            messages[count] = msg.data();
            // console.log(msg.data());
            var msgID = msg.id;
            firestore.collection('users/' + senderIDDB + "/chats").doc(msgID).update({
                seen: "true"
            })
            count++;
        })

        messages2.forEach(msg => {
            messages[count] = msg.data();
            //msg.seen = "true";
            count++;
        })

        messages.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
    }

    const [msgVal, setMsgVal] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        if (msgVal != "") {

            const {uid, photoURL} = auth.currentUser;

            await messagesRef1.add({
                msg: msgVal,
                SenderID: uid,
                ReceiverID: targetID,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                seen: "true"
            })

            await messagesRef2.add({
                msg: msgVal,
                SenderID: uid,
                ReceiverID: targetID,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                seen: "false"
            })

            setMsgVal('');
            dummy.current.scrollIntoView({behaviour: 'smooth'});
        }
    }

    return (
        <>
            <Box p={1}>
                <Paper>
                    <Box p={3}>
                        <Box display="flex" justifyContent="space-between">
                            <Box style={{
                                border: "0.5px solid black",
                                borderRadius: "10px",
                                margin: "5px",
                                padding: "10px",
                            }}>
                                {targetName}
                            </Box>
                            <Box style={{
                                border: "0.5px solid black",
                                borderRadius: "10px",
                                margin: "5px",
                                padding: "10px",
                            }}>
                                You
                            </Box>
                        </Box>
                        {messages && messages.map(msg => <ChatMessage key={msg.createdAt} message={msg}/>)}
                        <span ref={dummy}></span>
                    </Box>
                </Paper>
                <form onSubmit={sendMessage}>
                    <input type="text" value={msgVal} onChange={(e) => setMsgVal(e.target.value)}></input>
                    <button type="submit">Send</button>
                </form>
            </Box>
        </>
    )
}

function ChatMessage(props) {
    const {msg, SenderID} = props.message;

    //console.log(myID)
    //var text = "";
    //var result = "";
    //if(SenderID == myID) {text = "You"}
    //else{

    //   text = targetName;
    //}
    //console.log(text, oldText);
    //if(text == oldText && oldText != "") result = "";
    //else {
    //  result = text + ":";
    //  oldText = text;
    //}
    //const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div>
            {SenderID == myID ?
                <Box display="flex" justifyContent="flex-end">
                    <Box style={{
                        border: "0.5px solid black",
                        borderRadius: "10px",
                        margin: "5px",
                        padding: "10px",
                    }}
                    >
                        <Typography variant="body1" color="textPrimary">{msg}</Typography>
                    </Box>
                </Box>
                :
                <Box display="flex" justifyContent="flex-start">
                    <Box style={{
                        border: "0.5px solid black",
                        borderRadius: "10px",
                        margin: "5px",
                        padding: "10px",
                    }}
                    >
                        <Typography variant="body1" color="textPrimary">{msg}</Typography>
                    </Box>
                </Box>
            }
        </div>
    )

}


export default ChatRoom;