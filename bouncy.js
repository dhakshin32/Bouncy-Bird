import { defs, tiny } from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

export class Bouncy extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            ball: new defs.Grid_Sphere(60, 60, [[0, 2], [0, 1]]),
            cylinder: new defs.Capped_Cylinder(10, 10),
            background: new defs.Cube(),
        };

        // *** Materials
        this.materials = {
            tube: new Material(new defs.Phong_Shader(),
                { ambient: .8, diffusivity: 1, color: hex_color("#288A1C") }),
            ball: new Material(new defs.Phong_Shader(),
                {ambient: 1, specularity:1, diffusivity: 1, color: hex_color("#ffffff")}),
            background: new Material(new defs.Phong_Shader(),
                { ambient: 1, diffusivity: .6, color: hex_color("#CFF5FF")}),
        }
        this.initial_camera_location = Mat4.look_at(vec3(0, 12, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.model_transform = Mat4.identity().times(Mat4.translation(0, 0, 0));
        this.ball = Mat4.identity().times(Mat4.translation(-10, 0, -9))

        this.first=Mat4.identity();
        this.second=Mat4.identity();
        this.third=Mat4.identity();
        this.fourth=Mat4.identity();
        this.fifth=Mat4.identity();
        this.speed =5.0;

        this.h1=Math.random()*(30-5)+5;
        this.h2=Math.random()*(30-5)+5;
        this.h3=Math.random()*(30-5)+5;
        this.h4=Math.random()*(30-5)+5;
        this.h5=Math.random()*(30-5)+5;

        this.time=0;
        this.color = color(Math.random(), Math.random(), Math.random(), 1);

    }

    make_control_panel() {
        this.key_triggered_button("Up", ["u"], this.up);
        this.key_triggered_button("Change Colors", ["h"], this.set_colors);    
    }

    set_colors() {
        this.color = color(Math.random(), Math.random(), Math.random(), 1);
    }


    draw_ss(context, program_state, model_transform, old) {
        this.shapes.background.draw(context,program_state, Mat4.identity().times(Mat4.translation(0,0,-20)).times(Mat4.scale(50,50,50)), this.materials.background);
        this.time = this.time+0.5;
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        this.ball = this.model_transform = this.model_transform.times(Mat4.translation(0,-(this.time)/100,0));
        this.shapes.ball.draw(context, program_state, this.ball, this.materials.ball.override({color:this.color}));
        this.context = context;
        this.program_state = program_state;        
                                        
        if((this.speed*t%50) < 0.1) {
            this.h1 = Math.random()*(27-5)+5;
        }
        if((this.speed*t%60) < 0.1) {
            this.h2 = Math.random()*(27-5)+5;
        }
        if((this.speed*t%70) < 0.1) {
            this.h3 = Math.random()*(27-5)+5;
        }
        if((this.speed*t%80) < 0.1) {
            this.h4 = Math.random()*(27-5)+5;
        }
        if((this.speed*t%85) < 0.1) {
            this.h5 = Math.random()*(27-5)+5;
        }

        
        this.first  = Mat4.identity().times(Mat4.translation(0, -10, 0)).times(Mat4.rotation(0.86, 1, 0, 0)).times(Mat4.scale(1,1,this.h1));
        this.first  = this.first.times(Mat4.translation(-(this.speed*t%50)+25,0,0));

        this.second  = Mat4.identity().times(Mat4.translation(0, -10, 0)).times(Mat4.rotation(0.86, 1, 0, 0)).times(Mat4.scale(1,1,this.h2));
        this.second  = this.second.times(Mat4.translation(-(this.speed*t%60)+35,0,0));

        this.third  = Mat4.identity().times(Mat4.translation(0, -10, 0)).times(Mat4.rotation(0.86, 1, 0, 0)).times(Mat4.scale(1,1,this.h3));
        this.third  = this.third.times(Mat4.translation(-(this.speed*t%70)+42,0,0));

        this.fourth  = Mat4.identity().times(Mat4.translation(0, -10, 0)).times(Mat4.rotation(0.86, 1, 0, 0)).times(Mat4.scale(1,1,this.h4));
        this.fourth  = this.fourth.times(Mat4.translation(-(this.speed*t%80)+55,0,0));

        this.fifth  = Mat4.identity().times(Mat4.translation(0, -10, 0)).times(Mat4.rotation(0.86, 1, 0, 0)).times(Mat4.scale(1,1,this.h5));
        this.fifth  = this.fifth.times(Mat4.translation(-(this.speed*t%85)+60,0,0));
         
        this.shapes.cylinder.draw(context,program_state,this.first,this.materials.tube); 
        this.shapes.cylinder.draw(context,program_state,this.first,this.materials.tube);
        this.shapes.cylinder.draw(context,program_state,this.second,this.materials.tube);
        this.shapes.cylinder.draw(context,program_state,this.third,this.materials.tube);
        this.shapes.cylinder.draw(context,program_state,this.fourth,this.materials.tube);
        this.shapes.cylinder.draw(context,program_state,this.fifth,this.materials.tube);

        
    }

    up() {
        this.model_transform = (this.ball).times(Mat4.translation(0, 2, 0));
        this.ball = this.model_transform;
        this.time = 0;
        this.shapes.ball.draw(this.context, this.program_state, this.model_transform, this.materials.ball);
    }


    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, .1, 1000);

        const light_position = vec4(0, 0, 0, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();
        model_transform = this.draw_ss(context, program_state, model_transform,0);
    }
}