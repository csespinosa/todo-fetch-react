import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import ToDo from "../pages/ToDo.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/ToDo">
                <ToDo/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews