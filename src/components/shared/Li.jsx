import styled from "styled-components";

export const Li = styled.li`
    margin-left: var(--spacing_x5);
    font-weight: 400;

    & + & {
        margin-top: var(--spacing_x1);
    }

    &::marker {
        font-size: larger;
    }
`