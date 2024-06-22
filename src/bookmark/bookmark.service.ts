import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookmarkService {

    constructor(private databaseService: DatabaseService) {}

    // Create a bookmark
    async createBookmark(
        userId: number,
        createBookmarkDto: CreateBookmarkDto
    ) {
        return this.databaseService.bookmark.create({
            data: {
                ...createBookmarkDto,
                userId,
            }
        });
    }

    // Edit a bookmark
    async editBookmark(
        userId: number,
        bookmarkId: number,
        editBookmarkDto: EditBookmarkDto,
    ) {
        // Check if bookmark belongs to this user
        await this.getBookmarkById(userId, bookmarkId);
        
        // Update and return the bookmark
        return this.databaseService.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: editBookmarkDto
        });
    }

    // Get a bookmark by id
    async getBookmarkById(
        userId: number,
        bookmarkId: number
    ) {

        const bookmark = await this.databaseService.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        })

        if(bookmark.userId !== userId) {
            throw new UnauthorizedException('You don\'t have access to this bookmark');
        }

        return bookmark;
    }

    // Get all bookmarks for a user
    async getAllUserBookmarks(
        userId: number,
    ) {
        return this.databaseService.bookmark.findMany({
            where: {
                userId,
            }
        });
    }

    // Delete a bookmark
    async deleteBookmark(
        userId: number,
        bookmarkId: number,
    ) {

        // Check if user has access to this bookmark
        await this.getBookmarkById(userId, bookmarkId);

        await this.databaseService.bookmark.delete({
            where: {
                id: bookmarkId,
            }
        });

        return {
            message: 'Bookmark deleted successfully!'
        }
    }

}
