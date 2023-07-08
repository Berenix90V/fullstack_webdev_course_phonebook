const Notification = ({message, notificationType})=>{
    if(message!==null)
        return(
            <div className={notificationType}>{message}</div>
        )
}

export default Notification