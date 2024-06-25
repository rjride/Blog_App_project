import { Button, TableBody, TableCell, TableHead, TableRow,Table,styled } from "@mui/material";
import { categories } from "../../../constants/data.js";
import { Link, useSearchParams } from "react-router-dom";



const StyledTable = styled(Table)`
     border: 1px solid rgba(224,224,224,1);
`;
const StyledButton = styled(Button)`
   margin: 20px;
   width: 85%;
   background: #6495ED;
   color: #fff;
`
const StyleLink = styled(Link)`
   text-decoration: none;
   color: inherit;
`

const Categories = ()=>{
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    return (
<>
<StyleLink to={`/create?category=${category || ""}`}>
<StyledButton variant="contained">CREATE BLOG</StyledButton>
</StyleLink>
<StyledTable>
    <TableHead>
        <TableRow>
            <TableCell>
                <StyleLink to='/'>
                   All Categories
                </StyleLink>
            </TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {
     categories.map(category =>(
         <TableRow key={category.id}>
         <TableCell>
            <StyleLink to={`/?category=${category.type}`}>
            { category.type}
            </StyleLink>
         </TableCell>
     </TableRow>
    ))  
    }
    </TableBody>
</StyledTable>

</>

    )
}
export default Categories;