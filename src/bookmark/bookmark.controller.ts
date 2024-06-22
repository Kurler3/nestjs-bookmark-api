import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../user/decorator/user.decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { BookmarkService } from './bookmark.service';


@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) {}

    // Create a bookmark
    @Post('create')
    create(
        @GetUser('id') userId: number,
        @Body() createBookmarkDto: CreateBookmarkDto,
    ) {
        return this.bookmarkService.createBookmark(
            userId,
            createBookmarkDto
        );
    }

    // Update bookmark
    @Patch('edit/:bookmarkId')
    edit(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
        @Body() editBookmarkDto: EditBookmarkDto,
    ) {
        return this.bookmarkService.editBookmark(
            userId,
            bookmarkId,
            editBookmarkDto
        )
    }

    // Get bookmarks
    @Get('all')
    getAll(
        @GetUser('id') userId: number,
    ) {
        return this.bookmarkService.getAllUserBookmarks(userId);
    }

    // Get bookmark by id
    @Get('get/:bookmarkId')
    getBookmark(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
    ) {
        return this.bookmarkService.getBookmarkById(
            userId,
            bookmarkId,
        );
    }

    // Delete bookmark
    @Delete('delete/:bookmarkId')
    deleteBookmark(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
    ) {
        return this.bookmarkService.deleteBookmark(
            userId,
            bookmarkId,
        )
    }

}
