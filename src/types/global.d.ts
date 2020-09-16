import * as rfs from 'rotating-file-stream'

export interface Global {
    ls: rfs.RotatingFileStream;
}