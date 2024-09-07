import * as signalR from "@microsoft/signalr";
import { MessageResource, NotificationResource } from "../../resources";
import { MessageRequest } from ".";
import { getAccessToken } from "../../utils/auth";

const URL = "http://localhost:5151/serverHub";

class Connector {

    private connection: signalR.HubConnection;
    public events: (
        onMessageReceived?: (message: MessageResource) => void,
        onNotificationReceived?: (notification: NotificationResource) => void
    ) => void;

    static instance: Connector;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                skipNegotiation: true, // prevent warning | error when using diffenrent domain with server
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: async () => getAccessToken() ?? '',
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.start().catch(err => console.log(err));

        this.events = (onMessageReceived, onNotificationReceived) => {
            this.connection.on("NewMessage", (message: MessageResource) => {
                onMessageReceived?.(message);
            });

            this.connection.on("OrderNotification", (notification: NotificationResource) => {
                onNotificationReceived?.(notification)
            })
        };
    }

    public sendMessage = async (message: MessageRequest) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("SendMessage", message)
        } else {
            console.error("Chưa kết nối tới Server SignalR");
        }

    }

    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }
}
export default Connector.getInstance;