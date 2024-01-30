import { Buffer } from "buffer";
import process from "process";

window.process = process; 
window.Buffer = Buffer;
window.global ||= window