import ImageViewerComponent from './ImagesViewer'

const ImageViewer = {}

ImageViewer.install = Vue => {
    const ImageViewerConstructor = Vue.extend(ImageViewerComponent);
    const instance = new ImageViewerConstructor();
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)
    Vue.directive('drag', {
        bind: function (el, binding, vnode) {
            var positionX = 0,
                positionY = 0,
                mousedownX = 0,
                mousedownY = 0,
                mouseX = 0,
                mouseY = 0,
                moveX = 0,
                moveY = 0,
                target = el,
                isMove = false;
            // 查看是否有指定绑定参数
            // if (binding.expression !== undefined) {
            //     // 因为vue有渲染延迟的原因，所以只能通过在vue生成的dom元素上进行获取
            //     var handle = el.querySelectorAll(binding.value);
            // } else {
            //     var handle = [];
            //     handle.push(el);
            // }
            // handle.forEach(function(dom) {
                el.onmousedown = function(e) {
                    isMove = true;

                    positionX = target.offsetLeft;
                    positionY = target.offsetTop;
                    mousedownX = e.pageX;
                    mousedownY = e.pageY;

                    return false;
                };

                el.addEventListener('mouseup', function(e) {
                    isMove = false;
                });
            // });

            // 如果不指定前缀，则默认使用document为实例对象
            addEventListener('mousemove', function(e) {
                if (isMove) {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    moveX = positionX + mouseX - mousedownX;
                    moveY = positionY + mouseY - mousedownY;
                    let dom_rect = target.getBoundingClientRect()
                    // console.log("getBoundingClientRect:", dom_rect);
                    // let dom_rect = target.getClientRects ()
                    var currentWidth = dom_rect.width
                    var currentHeight = dom_rect.height
                    var bw = document.body.clientWidth;
                    // var bh = document.body.clientHeight;
                    var bh = document.documentElement.clientHeight;
                    var naturalWidth = target.naturalWidth
                    var naturalHeight = target.naturalHeight

                    if(currentWidth >= naturalWidth) {
                        let enlargedX = (currentWidth - naturalWidth) / 2
                        let moveXenlarged = 0
                        if(moveX < 0) {
                            moveXenlarged = -(Math.abs(moveX) + enlargedX)
                            // console.log("enlargedX", enlargedX);
                            // console.log("naturalWidth", naturalWidth);
                            // console.log("currentWidth", currentWidth);
                            if( (moveXenlarged + currentWidth) < 200 ) {
                                // console.log('放大-左越界'); // -------------------sucess
                                moveX = -(naturalWidth + enlargedX - 200)
                            }
                        }else {
                            moveXenlarged = bw + enlargedX
                            if( (moveXenlarged - moveX) < 200) {
                                // console.log('放大-右越界');
                                moveX = moveXenlarged - 200 // -------------------sucess
                            }
                        }
                    }else{
                        let shrinkedX = ( naturalWidth - currentWidth ) / 2
                        let moveXshrinked = 0
                        if(moveX < 0) {
                            moveXshrinked = -(Math.abs(moveX) + shrinkedX)
                            // console.log("moveXshrinked", moveXshrinked);
                            // console.log("shrinkedX", shrinkedX);
                            // console.log("currentWidth", currentWidth );
                            if( (moveXshrinked + currentWidth + shrinkedX) < 200 ) {
                                // console.log('缩小-左越界'); // -------------------sucess
                                moveX = -(currentWidth + shrinkedX - 200)
                            }
                        }else {
                            moveXshrinked = moveX + shrinkedX
                            if( ( bw - moveXshrinked) < 200) {
                                // console.log('缩小-右越界');
                                moveX = bw - shrinkedX - 200 // -------------------sucess
                            }
                        }
                    }

                    if(currentHeight >= naturalHeight) {
                        let enlargedY = (currentHeight - naturalHeight) / 2
                        let moveYenlarged = 0
                        if(moveY < 0) {
                            moveYenlarged = -(Math.abs(moveY) + enlargedY)
                            if( (moveYenlarged + currentHeight) < 200 ) {
                                // console.log('放大-上越界');
                                moveY = -(naturalHeight + enlargedY - 200)// -------------------sucess
                            }
                        }else {
                            moveYenlarged = bh + enlargedY
                            // console.log("bh", bh);
                            // console.log("enlargedY", enlargedY);
                            if( (moveYenlarged - moveY) < 200) {
                                // console.log('放大-下越界');
                                moveY = moveYenlarged - 200// -------------------sucess
                            }
                        }
                    }else{
                        let shrinkedY = ( naturalHeight - currentHeight ) / 2
                        // console.log("moveY:", moveY);
                        // console.log("bh:", bh);
                        // console.log("11111111moveY+bh:", Math.abs(moveY) + bh);
                        // console.log("11111111shrinkedY:", shrinkedY);

                        // console.log("naturalHeight:", naturalHeight);
                        let moveYshrinked = 0
                        if(moveY < 0) {
                            moveYshrinked = -(Math.abs(moveY) + shrinkedY)
                            // console.log("shrinkedY:", shrinkedY);
                            // console.log("moveYshrinked:", moveYshrinked);
                            // console.log("naturalHeight:", naturalHeight);
                            if( (naturalHeight + moveYshrinked) < 200) {
                                // console.log('缩小-上越界');
                                moveY = -(naturalHeight - shrinkedY - 200) // -------------------sucess
                            }
                        }else{
                            moveYshrinked = moveY + shrinkedY
                            // console.log("222222222moveYshrinked:", moveYshrinked);
                            // console.log("222222222bh:", bh);
                            if( (bh - moveYshrinked) < 200) {
                                // console.log('缩小-下越界');
                                moveY = bh - shrinkedY - 200 // -------------------sucess
                            }
                        }
                    }

                    target.style.left = moveX+'px';
                    target.style.top = moveY+'px';
                    binding.value({x: e.moveX, y: e.moveY})
                } else {
                    return false;
                }
            });

            addEventListener('mouseup', function() {
                isMove = false;
            });

        }
    })

    // 挂载触发方法
    Vue.prototype.$imageViewer = (e, img_list) => {
        // console.log("imageViewer", data);
        // console.log(e.currentTarget.getAttribute(''), 'e.currentTarget');
        // console.log(e.target.getAttribute('idx'), 'e.target');
        // instance.currentSrc = e.currentTarget.currentSrc;
        if(e.target.nodeName === "IMG" && e.target.getAttribute("idx")) {
            instance.visible = true;
            const index = Number( e.target.getAttribute("idx") )
            instance.image_list = img_list;
            instance.current_index = index;
            instance.currentSrc = img_list[index].picture_address;
            instance.image_name = img_list[index].name;
            instance.url = img_list[index].url;
            instance.share_address = img_list[index].share_address;
        }
    }

}

export default ImageViewer;