import { gql } from '@apollo/client';

export default gql`
    query ls($path: String!) {
        ls(path: $path) {
            name,
            path,
            extension,
            isDirectory,
            parentDirectory,
            createdDate,
            size,
            populatedDate
        }
    }
`;
