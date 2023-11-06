import { Post } from "@prisma/client";

export interface ImageModel {
    id: number;
    name: string;
    postId: number;
    post: Post;
  }
  