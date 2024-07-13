import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


function Prayers({name, time, image}) {
return (
        <Card sx={{ width: "17%" }}>
            <CardMedia
                sx={{ height: 140, width: "100%" }}
                image={image}
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h4" component="div">
                    {name}   
                </Typography>
                <Typography variant="h2" color="text.secondary">
                    {time}
                </Typography>
            </CardContent>
        </Card>
);
}

export default Prayers;