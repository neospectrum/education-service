import { NextFunction, Response } from 'express';
import { fileService } from '../services/file.service';
import { File } from '../models/models';
import colors from 'colors';
import { UserResponse } from 'types/express';
import { error } from 'console';
import ApiError from '../error/ApiError';

export class FileController {
	async createDir(req: any, res: Response, next: NextFunction) {
		try {
			// TODO: COMPLETE CONTROLLER
			const { name, type } = req.body;
			let { parentId } = req.body;

			if (!parentId) {
				parentId =  null;
			}

			const user: UserResponse = req.user;

			const file = await fileService.generateDir(name, type, user, parentId);

			return res.json(file);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	async uploadFile(req: any, res: Response, next: NextFunction) {
		try {
			const { parentId } = req.body;
			const file = req.files?.file;
			const user = req.user;
			
			const uploadedFile = await fileService.uploadFile(file, user, parentId);

			res.json(uploadedFile);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	async downloadFile(req: any, res: Response, next: NextFunction) {
		try {
			const fileId = req.query.id;
			const user: UserResponse = req.user;

			const { path, fileName } = await fileService.downloadFile(fileId, user);

			return res.download(path, fileName);
		} catch (error) {
			console.log(error);
			next(error);
		}	
	}
	async deleteFile(req: any, res: Response, next: NextFunction) {
		try {
			const fileId = req.query.id;
			const user: UserResponse = req.user;

			const file = await File.findOne({ where: { id: fileId, userId: user.id }});
			if (!file) {
				return res.status(400).json({message: 'file not found'});
			}
			fileService.deleteFile(file);
			await file.destroy();
			return res.json({message: 'File was deleted'});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	async getFiles(req: any, res: Response, next: NextFunction) {
		try {
			const user = req.user;
			const parentId = req.query.parentId;

			let files;
			if (parentId) {
				files = await File.findAll({ where: { userId: user.id, parentId }});
			} else {
				files  = await File.findAll({ where: { userId: user.id }});
			}

			return res.json({files});
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
}

export const fileController = new FileController();